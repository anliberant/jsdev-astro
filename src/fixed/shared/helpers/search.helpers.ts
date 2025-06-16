import { ContentNode } from '../types/content.types';

const getSearchResult = (
  posts: ContentNode[],
  searchQuery: string
): ContentNode[] => {
  const filteredPostsByTitle = posts.filter(
    (post, idx) =>
      post.frontmatter.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      post.frontmatter.title.toLowerCase().startsWith(searchQuery.toLowerCase())
  );

  const filteredPostsByDesc = posts.filter((post, idx) =>
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const permalinksByTitle: string[] = [];
  filteredPostsByTitle.map(post => {
    permalinksByTitle.push(post.frontmatter.permalink);
  });
  const filteredPostsByDescription = filteredPostsByDesc.filter(
    post => !permalinksByTitle.join('').includes(post.frontmatter.permalink)
  );
  const unionPosts = [...filteredPostsByTitle, ...filteredPostsByDescription];

  return unionPosts;
};

export { getSearchResult };
