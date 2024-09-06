import { createClient } from "contentful";

const contentfulClient = createClient({
    accessToken: `${process.env.CONTENTFUL_API_TOKEN}`,
    space: `${process.env.CONTENTFUL_SPACE_ID}`
})

export default contentfulClient