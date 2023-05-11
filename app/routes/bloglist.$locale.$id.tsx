import { V2_MetaFunction, useLoaderData } from "@remix-run/react";
import { gql } from "@apollo/client";
import { apolloClient } from "apollo/apolloClient";
import { LoaderFunction, json } from "@remix-run/node";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";

export const meta: V2_MetaFunction = ({ data }) => {
  return [{ title: data.blogPost.title }];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  console.log(params);
  try {
    const { data } = await apolloClient.query({
      query: gql`
        query blogPostEntryQuery($postID: String!, $language: String!) {
          blogPost(id: $postID, locale: $language) {
            title
            content {
              json
            }
          }
        }
      `,
      variables: { postID: params.id, language: params.locale },
    });
    return json(data);
  } catch (e) {
    console.log(e);
    return json({ error: "An error occurred" });
  }
};

function BlogDetails() {
  const {
    blogPost: { title, content },
  } = useLoaderData();

  const contentText = documentToHtmlString(content.json);

  return (
    <div>
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: contentText }} />
    </div>
  );
}
export default BlogDetails;
