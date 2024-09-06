import { createClient } from "contentful-management";

export const contentfulManagementClient  = createClient({
    accessToken: `${process.env.CONTENTFUL_MANAGEMENT_TOKEN}`
})

export const getContentfulEnvironment = async () => {
    const space = await contentfulManagementClient.getSpace(`${process.env.CONTENTFUL_SPACE_ID}`);
    const environment = await space.getEnvironment(`${process.env.CONTENTFUL_ENVIRONMENT_ID}`);
    return environment;
};