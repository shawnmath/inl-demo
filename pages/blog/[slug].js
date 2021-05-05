import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { getAllPostsWithSlug, getPost } from '../../lib/api';
import styles from '../../styles/Home.module.css';
import blogStyles from '../../styles/Blog.module.css';

const formatDate = date => {
  const newDate = new Date(date);
  return `${newDate.getMonth() + 1}/${newDate.getDate()}/${newDate.getFullYear()}`;
}

const Post = ({ postData }) => {
  const router = useRouter();

  if (!router.isFallback && !postData?.slug) {
    return <p>Looks like an error....</p>;
  }

  // TODO: replace postData.content img src urls w/ API_URL endpoint
  return (
    <div className={styles.container}>
      <Head>
        <title>{postData.title}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className={styles.main}>
        {
          router.isFallback 
            ? <h2>Loading....</h2>
            : (
              <article className={blogStyles.article}>
                <div className={blogStyles.postmeta}>
                  <h1 className={styles.title}>{postData.title}</h1>
                  <p>{formatDate(postData.date)}</p>
                </div>
                <div
                  className='post-content content'
                  dangerouslySetInnerHTML={{__html: postData.content}}
                />                
              </article>
            )
        }
        <p>
          <Link href='/blog'>
            <a>Back to Posts</a>
          </Link>
        </p>
      </main>
    </div>
  );  
};

export default Post;

export async function getStaticPaths() {
  const allPostsWithSlug = await getAllPostsWithSlug();

  return {
    paths: allPostsWithSlug.edges.map(({ node }) => `/blog/${node.slug}`) || [],
    fallback: false
  };
};

export async function getStaticProps({ params }) {
  const data = await getPost(params.slug);

  return {
    props: {
      postData: data.post
    }
  };
};