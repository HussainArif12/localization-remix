import { NavLink, V2_MetaFunction, useLoaderData } from "@remix-run/react";
import { gql } from "@apollo/client";
import { apolloClient } from "apollo/apolloClient";
import { LoaderFunction, json } from "@remix-run/node";

export const meta: V2_MetaFunction = () => {
  return [{ title: "Blog list" }];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  try {
    const { data } = await apolloClient.query({
      query: gql`
        query blogPostCollectionQuery($language: String!) {
          blogPostCollection(locale: $language) {
            items {
              sys {
                id
              }
              title
            }
          }
        }
      `,
      variables: { language: params.locale },
    });
    return json(data);
  } catch (e) {
    console.log(e);
    return json({ error: "An error occurred" });
  }
};

interface BlogPost {
  sys: Sys;
  title: string;
}

interface Sys {
  id: string;
}

function BlogList() {
  const {
    blogPostCollection: { items },
  } = useLoaderData();

  return (
    <div>
      <h1>Here is a list of blog entries:</h1>
      {items.map((item: BlogPost) => {
        return (
          <div key={item.sys.id}>
            <NavLink to={`${item.sys.id}`}>
              <p>{item.title} </p>
            </NavLink>
          </div>
        );
      })}
    </div>
  );
}
export default BlogList;
