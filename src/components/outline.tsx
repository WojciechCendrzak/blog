import React, { useEffect, useRef, useState } from 'react';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  LAYOUT_FOOTER_HEIGHT,
  LAYOUT_HEADER_HEIGHT,
  MARGIN,
  MIDDLE_COLUMN_SIZE,
  POST_MARGIN_BOTTOM,
} from '../const/sizes';
import { getIsOutline } from '../logic/store/post.selector';
import { postSlice } from '../logic/store/post.slice';

export const Outline: React.FC = () => {
  const dispatch = useDispatch();
  const [outLineTop, setOutLineTop] = React.useState(0);
  const [outlineHeight, setOutlineHeight] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const items = useSelector(getIsOutline);

  useEffect(() => {
    setOutlineHeight(ref.current?.clientHeight || 0);
    dispatch(postSlice.actions.reset());
  }, [dispatch]);

  const handleScroll = useCallback(() => {
    const { scrollY, innerHeight } = window;
    const clientHeight = document.body.clientHeight;
    const isReachedTop = scrollY > LAYOUT_HEADER_HEIGHT - MARGIN;

    if (isReachedTop) {
      const visibleFooterPart = Math.max(
        scrollY + innerHeight - clientHeight + LAYOUT_FOOTER_HEIGHT + POST_MARGIN_BOTTOM,
        0
      );
      const top = Math.min(innerHeight - outlineHeight - visibleFooterPart, MARGIN);

      setOutLineTop(top);
    } else {
      setOutLineTop(0);
    }
  }, [outlineHeight]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleOnItemClick = useCallback(
    (y: number) => () => {
      window.scrollTo(0, y);
    },
    []
  );

  return (
    <OutlineSticker outLineTop={outLineTop} ref={ref}>
      <OutlineContainer>
        <OutlineItems>
          {items?.map((item, index) => (
            <OutlineItem key={index} onClick={handleOnItemClick(item.offsetTop)}>
              {item.isReached ? <strong>{item.title}</strong> : item.title}
            </OutlineItem>
          ))}
        </OutlineItems>
      </OutlineContainer>
    </OutlineSticker>
  );
};

const OutlineSticker = styled.div<{ outLineTop: number }>`
  ${({ outLineTop }) =>
    outLineTop
      ? `
          position: fixed;
          top: ${outLineTop}px;
          width: calc((100% - ${MIDDLE_COLUMN_SIZE}) / 2);
        `
      : ''}
`;

const OutlineContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 ${MARGIN}px;
`;

const OutlineItems = styled.div`
  font-size: 12px;
  font-weight: 100;
`;

const OutlineItem = styled.div`
  margin-bottom: 5px;
  cursor: pointer;
`;
