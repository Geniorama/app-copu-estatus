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
      if (storedCompanies && storedCompanies.length > 0) {
        return JSON.parse(storedCompanies);
      } else {
        const result = await getAllCompanies();
        const companies = result.companies;
        if (companies.length > 0) {
          const options = companies
            .map((company: CompanyResponse) => ({
              value: company.sys.id,
              name: company.fields.name["en-US"],
            }))
          localStorage.setItem("companiesOptions", JSON.stringify(options));
          return options;
        } else {
          console.log("No companies found");
          return rejectWithValue("No companies found");
        }
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
        localStorage.setItem("companiesOptions", JSON.stringify(state.options));
      }
    },

    removeCompanyOption: (state, action) => {
      const companyToRemove = action.payload as OptionSelect;
      state.options = state.options.filter(
        (option) => option.value !== companyToRemove.value
      );

      if(companyToRemove.value) {
        
        localStorage.setItem("companiesOptions", JSON.stringify(state.options));
      }
    },

    resetCompaniesOptions: (state) => {
      state.options = [];
      state.loading = false;
      state.error = null;

      localStorage.removeItem("companiesOptions");
    }
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

export const { addCompanyOption, resetCompaniesOptions, removeCompanyOption } = companiesSlice.actions;
export default companiesSlice.reducer;
