"use client";

import { useState, useEffect } from "react";
import Button from "@/app/utilities/ui/Button";
import Table from "@/app/components/Table/Table";
import Search from "@/app/utilities/ui/Search";
import LinkCP from "@/app/utilities/ui/LinkCP";
import Modal from "@/app/components/Modal/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import type { Content, TableDataProps } from "@/app/types";
import type { ChangeEvent } from "react";
import TitleSection from "@/app/utilities/ui/TitleSection";
import FilterContentBar from "../FilterContentBar";
import FormCreateContent from "@/app/components/Form/FormCreateContent";
import { getAllContents } from "@/app/utilities/helpers/fetchers";
import { Entry } from "contentful-management";
import Spinner from "@/app/utilities/ui/Spinner";
import { actionOptions } from "@/app/components/Form/FormCreateContent";
import { formattedDate } from "@/app/utilities/helpers/formatters";
import { fetchCompaniesOptions } from "@/app/store/features/companiesSlice";
import { AppDispatch, RootState } from "@/app/store";
import { useDispatch, useSelector } from "react-redux";
import { useFetchServices } from "@/app/hooks/useFetchServices";
import type { ServiceOptionsProps } from "../FilterContentBar";
import type { FilterDataProps } from "@/app/types";
import useExportCSV from "@/app/hooks/useExportCSV";

const headsTable = [
  "ID",
  "Tipo acción",
  "Titular",
  "Fecha Publicación",
  "Url Web",
  "Url IG",
  "Url FB",
  "Url LK",
  "",
];

export default function Contents() {
  const [searchValue, setSearchValue] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [contents, setContents] = useState<TableDataProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasUpdate, setHasUpdate] = useState(false);
  const [postWebCount, setPostWebCount] = useState(0);
  const [postSocialCount, setPostSocialCount] = useState(0);
  const [optionsServices, setOptionsServices] = useState<
    ServiceOptionsProps[] | null
  >(null);
  const [originalData, setOriginalData] = useState<Content[] | null>(null);
  const [filters, setFilters] = useState<Partial<FilterDataProps>>({});
  const [filteredData, setFilteredData] = useState<Content[] | null>(null);

  const dispatch = useDispatch<AppDispatch>();

  const showSocialLink = (link?: string) => {
    if (link) {
      return (
        <LinkCP target="_blank" href={link}>
          Link
        </LinkCP>
      );
    }

    return <p className="text-slate-400">Sin enlace</p>;
  };

  const { options: companiesData } = useSelector(
    (state: RootState) => state.companies
  );
  const { dataServices, loading: loadingServices } = useFetchServices({
    hasUpdate,
  });

  useEffect(() => {
    dispatch(fetchCompaniesOptions());
  }, []);

  useEffect(() => {
    if (dataServices && !loadingServices) {
      const options: ServiceOptionsProps[] = dataServices.map((service) => ({
        value: service.id || "",
        name: service.name,
        companyId: service.companyId || "",
      }));

      if (options) {
        setOptionsServices(options);
      }
    }
  }, [dataServices, loadingServices]);

  const rowsTable = (data: Content[]) => {
    const result = data.map((content) => [
      content.id,
      actionOptions.find((option) => option.value === content.type)?.name,
      content.headline,
      formattedDate(content.publicationDate),
      showSocialLink(
        content.socialMediaInfo?.find((social) => social.id === "webcopu")?.link
      ),
      showSocialLink(
        content.socialMediaInfo?.find((social) => social.id === "instagram")
          ?.link
      ),
      showSocialLink(
        content.socialMediaInfo?.find((social) => social.id === "facebook")
          ?.link
      ),
      showSocialLink(
        content.socialMediaInfo?.find((social) => social.id === "linkedin")
          ?.link
      ),
      <LinkCP key={content.id}>Editar</LinkCP>,
    ]);

    return result;
  };

  const fetchAllContents = async () => {
    setLoading(true);
    const res = await getAllContents();
    if (res) {
      const transformData: Content[] = res.map((content: Entry) => ({
        id: content.sys.id,
        headline: content.fields.headline["en-US"],
        type: content.fields.type["en-US"],
        publicationDate: content.fields.publicationDate["en-US"],
        socialMediaInfo: content.fields.socialLinksAndStatistics["en-US"],
        serviceId: content.fields.service["en-US"].sys.id,
      }));

      const tableData: TableDataProps = {
        heads: headsTable,
        rows: rowsTable(transformData),
      };

      setContents(tableData);
      setOriginalData(transformData);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllContents();
  }, [hasUpdate]);

  useEffect(() => {
    if (filteredData) {
      const filterWebContents = filteredData.filter(
        (post) => post.type === "web"
      );
      const filterSocialContents = filteredData.filter(
        (post) => post.type === "post"
      );

      if (filterWebContents) {
        setPostWebCount(filterWebContents.length);
      }

      if (filterSocialContents) {
        setPostSocialCount(filterSocialContents.length);
      }
    } else {
      if (originalData) {
        const filterWebContents = originalData.filter(
          (post) => post.type === "web"
        );
        const filterSocialContents = originalData.filter(
          (post) => post.type === "post"
        );

        if (filterWebContents) {
          setPostWebCount(filterWebContents.length);
        }

        if (filterSocialContents) {
          setPostSocialCount(filterSocialContents.length);
        }
      }
    }
  }, [filteredData, originalData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSubmitForm = (contentId?: string) => {
    if (contentId) {
      setHasUpdate(true);
    }
  };

  const handleFilterBar = (newFilter: Partial<FilterDataProps>) => {
    if (!originalData) return;

    const updatedFilters = { ...filters, ...newFilter };
    setFilters(updatedFilters);

    const filtered = originalData.filter((content) => {
      return Object.entries(updatedFilters).every(([key, value]) => {
        if (!value) return true; // Ignora claves sin valor

        if (key === "service") {
          return content.serviceId === value;
        }

        if (key === "publicationDate") {
          return content.publicationDate === value;
        }

        return true;
      });
    });

    const tableDataFiltered: TableDataProps = {
      heads: headsTable,
      rows: rowsTable(filtered),
    };

    setContents(tableDataFiltered);
    setFilteredData(filtered);
  };

  const handleClearFilter = () => {
    if (!originalData) return;

    setFilteredData(null);
    setFilters({});
    const tableDataOriginal: TableDataProps = {
      heads: headsTable,
      rows: rowsTable(originalData),
    };
    setContents(tableDataOriginal);
  };

  useEffect(() => {
    if (!originalData) return;

    const lowerSearchValue = searchValue.toLowerCase();

    const filtered = originalData.filter((content) => {
      const idMatch = content.id?.toLowerCase().includes(lowerSearchValue);
      const typeMatch = actionOptions
        .find((option) => option.value === content.type)
        ?.name?.toLowerCase()
        .includes(lowerSearchValue);
      const headlineMatch = content.headline
        ?.toLowerCase()
        .includes(lowerSearchValue);

      return idMatch || typeMatch || headlineMatch;
    });

    const tableDataFiltered: TableDataProps = {
      heads: headsTable,
      rows: rowsTable(filtered),
    };

    setContents(tableDataFiltered);
    setFilteredData(filtered);
  }, [searchValue, originalData]);

  const exportToCSV = useExportCSV(originalData as Record<string, string | number>[], ["id", "headline", "type", "publicationDate", "serviceId"], `contents-${new Date().toISOString()}`)

  if (loading) {
    return (
      <div>
        <div className="mb-5">
          <TitleSection title="Compañías" />
        </div>
        <div className="w-full h-[70vh] flex justify-center items-center">
          <span className="text-8xl">
            <Spinner />
          </span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <FormCreateContent
          onSubmit={handleSubmitForm}
          onClose={() => setOpenModal(false)}
        />
      </Modal>
      <div className="mb-5">
        <TitleSection title="Contenidos" />
      </div>
      {companiesData && (
        <FilterContentBar
          companies={companiesData}
          services={optionsServices}
          onFilter={handleFilterBar}
          onCleanForm={handleClearFilter}
        />
      )}
      <div className="flex gap-4 mb-8 justify-center">
        {filters.service && filteredData && filteredData.length > 0 && (
          <div className="w-full max-w-xs text-slate-300 bg-slate-800 p-8 rounded-lg hover:outline-3 text-left flex items-start flex-col justify-center">
            <ul className=" gap-4 flex flex-col">
              <li>
                <b>Nombre paquete: </b> {dataServices?.find((service) => service.id === filters.service)?.name}
              </li>
              <li>
                <b>Fecha expiración: </b>{formattedDate(dataServices?.find((service) => service.id === filters.service)?.endDate)}
              </li>
              <li>
                <b>Tipo plan: </b>{dataServices?.find((service) => service.id === filters.service)?.plan?.toUpperCase()}
              </li>
              <li>
                <b>Publicaciones restantes: </b>50
              </li>
            </ul>
          </div>
        )}
        <div className="w-full max-w-xs text-cp-primary bg-slate-800 p-8 rounded-lg hover:outline-3 text-center">
          <h3 className="text-xl font-bold min-h-14">
            Post en social media y artículo web
          </h3>
          <span className="text-8xl">{postSocialCount}</span>
        </div>
        <div className="w-full max-w-xs text-cp-primary bg-slate-800 p-8 rounded-lg hover:outline-3 text-center">
          <h3 className="text-xl font-bold min-h-14">Artículo web</h3>
          <span className="text-8xl">{postWebCount}</span>
        </div>
      </div>

      <div className="flex gap-3 items-center justify-between">
        <Button onClick={() => setOpenModal(true)} mode="cp-green">
          <span className="mr-3">Nuevo contenido</span>
          <FontAwesomeIcon icon={faPlus} />
        </Button>

        <div className="flex gap-6 items-center">
          <LinkCP onClick={exportToCSV} href="#">Exportar CSV</LinkCP>
          <Search onChange={handleChange} value={searchValue} />
        </div>
      </div>

      {contents && contents.rows.length > 0 ? (
        <Table data={contents} />
      ) : (
        <div className="text-center p-5 mt-10 flex justify-center items-center">
          <p className="text-slate-400">
            No hay datos disponibles o no hay coincidencias con la búsqueda.
          </p>
        </div>
      )}
    </div>
  );
}
