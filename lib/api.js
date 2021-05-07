// const API_URL = process.env.WP_API_URL;
const API_URL = 'http://inl-demo.azurewebsites.net/graphql'

async function fetchAPI(query, { variables, refreshToken } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  if (refreshToken) {
    headers['Authorization'] = `Bearer ${refreshToken}`;
  }  

  const res = await fetch(API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables })
  });

  const json = await res.json();
  if (json.errors) {
    console.log(json.errors)
    console.log('Error Details:', query, variables);
    throw new Error('Failed to fetch API');
  }

  return json.data;
};

export async function getAllPosts(preview) {
  const data = await fetchAPI(`
    query AllPosts {
      posts(first: 20, where: {
        orderby: {
          field: DATE,
          order: DESC
        }
      }) {
        edges {
          node {
            id
            date
            title
            slug
            featuredImage {
              node {
                sourceUrl
              }
            }
          }
        }
      }
    }
  `);

  return data?.posts;
};

export async function getAllPostsWithSlug() {
  const data = await fetchAPI(`
    query AllPostsWithSlug {
      posts(first:10000) {
        edges {
          node {
            slug
          }
        }
      }
    }
  `);

  return data?.posts;
};

export async function getPost(slug, refreshToken) {
  const data = await fetchAPI(`
    fragment PostFields on Post {
      title
      excerpt
      slug
      date
      featuredImage {
        node {
          sourceUrl
        }
      }
    }
    query PostBySlug($id: ID!, $idType: PostIdType!) {
      post(id: $id, idType: $idType) {
        ...PostFields,
        content
      }
    }
  `, {
    variables: {
      id: slug,
      idType: 'SLUG'
    },
    refreshToken
  });

  return data;
}

export async function getPostByDatabaseID(id, refreshToken) {
  const data = await fetchAPI(`
    fragment PostFields on Post {
      title
      status
      excerpt
      slug
      date
      featuredImage {
        node {
          sourceUrl
        }
      }
    }
    query PostByDatabaseID($id: ID!, $idType: PostIdType!) {
      post(id: $id, idType: $idType) {
        ...PostFields,
        content
      }
    }
  `, {
    variables: {
      id,
      idType: 'DATABASE_ID'
    },
    refreshToken
  });

  return data;
}

export async function loginUser(username, password) {
  const user = await fetchAPI(`
    mutation LoginUser(
      $username: String!,
      $password: String!
    ) {
      login(
        input: {
          username: $username,
          password: $password
        }
      ) {
        refreshToken
        user {
          name
        }
      }
    }
  `, {
    variables: {
      username,
      password
    }
  });

  return user.login;
};