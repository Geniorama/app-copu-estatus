import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllCompanies } from "@/app/utilities/helpers/fetchers";
import type { OptionSelect, CompanyResponse } from "@/app/types";

interface CompaniesState {
  options: OptionSelect[];
  loading: boolean;
  error: string | null;
}

const initialState: CompaniesState = {
  options: [],
  loading: false,
  error: null,
};

export const fetchCompaniesOptions = createAsyncThunk(
  "companies/fetchCompaniesOptions",
  async (_, { rejectWithValue }) => {
    try {
      const storedCompanies = localStorage.getItem("companiesOptions");
      if (storedCompanies) {
        return JSON.parse(storedCompanies);
      } else {
        const companies = await getAllCompanies();
        const options = companies
          .map((company: CompanyResponse) => ({
            value: company.sys.id,
            name: company.fields.name["en-US"],
          }))
          .sort((a: OptionSelect, b: OptionSelect) =>
            a.name.localeCompare(b.name)
          );

        localStorage.setItem("companiesOptions", JSON.stringify(options));
        return options;
      }
    } catch (error) {
      return rejectWithValue("Error fetching companies options");
    }
  }
);

const companiesSlice = createSlice({
  name: "companies",
  initialState,
  reducers: {
    addCompanyOption: (state, action) => {
      const newCompany = action.payload as OptionSelect;

      // Evitar duplicados
      const exists = state.options.some(
        (option) => option.value === newCompany.value
      );

      if (!exists) {
        state.options.push(newCompany);

        // Opcional: Guardar en localStorage para persistencia
        localStorage.setItem(
          "companiesOptions",
          JSON.stringify(state.options)
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompaniesOptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompaniesOptions.fulfilled, (state, action) => {
        state.options = action.payload;
        state.loading = false;
      })
      .addCase(fetchCompaniesOptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addCompanyOption } = companiesSlice.actions;
export default companiesSlice.reducer;
