import Head from 'next/head';
import Link from 'next/link';
import { getAllPosts } from '../../lib/api';
import styles from '../../styles/Home.module.css';
import blogStyles from '../../styles/Blog.module.css';

const Blog = ({ allPosts }) => {
  const { edges } = allPosts;
  console.log(edges)
  return (
    <div className={styles.container}>
      <Head>
        <title>Blog articles page</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>Latest blog articles</h1>
        <hr />
        <section>
          {edges.map(({ node }) => (
            <div className={blogStyles.listitem} key={node.id}>
              { node.featuredImage && (
                <div className={blogStyles.listitem__thumbnail}>
                  <figure>
                    <img src={ `http://inl-demo.azurewebsites.net/${node.featuredImage?.node.sourceUrl}` } alt={node.title} />
                  </figure>
                </div>
              ) }              
              <div className={blogStyles.listitem__content}>
                <h2>{node.title}</h2>
                <p>{node.slug}</p>
                <Link href={`/blog/${node.slug}`}>
                  <a>Read More</a>
                </Link>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>  
  );
};

export default Blog;

export async function getStaticProps() {
  const allPosts = await getAllPosts();
  return {
    props: {
      allPosts
    }
  };
};