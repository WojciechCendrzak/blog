import { PostDescription } from '../../post/post.model';
import Link from 'next/link';
import { Date } from '../../../components/date';
import styled from 'styled-components';
import Image from 'next/image';

interface PostCardProps {
  post: PostDescription;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { id, date, title } = post;
  return (
    <CardContainer>
      <LinkContainer>
        <Link href={`/post/${id}`}>
          <Description>
            <PostTitle>{title}</PostTitle>
            <CardFooter>
              {date && <Date date={date} />}
              {post.tags && <>{post.tags}</>}
            </CardFooter>
          </Description>
        </Link>
      </LinkContainer>
      <PostImageContainer>
        {post.image && <PostImage priority src={post.image} width={226} height={120} alt={post.title} />}
      </PostImageContainer>
    </CardContainer>
  );
};

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 3rem;
`;

const LinkContainer = styled.div`
  flex: 1;
  display: flex;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const PostImageContainer = styled.div`
  margin-left: 2rem;

  @media only screen and (max-width: 768px) {
    display: none;
  }
`;

const PostImage = styled(Image)`
  object-fit: cover;
`;

const Description = styled.div`
  flex: 1;
  font-weight: 300;
  justify-content: space-around;
  display: flex;
  flex-direction: column;
`;

const PostTitle = styled.div`
  text-align: justify;
`;

const CardFooter = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 1rem;
  font-weight: 100;
  font-size: 14px;
`;
