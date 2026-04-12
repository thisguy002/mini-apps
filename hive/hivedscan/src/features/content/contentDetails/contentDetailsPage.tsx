import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'app/store/rootReducer';
import { fetchContent } from './contentDetailsSlice';
import renderHTML from 'react-render-html';
import Skeleton from 'react-loading-skeleton';
import AppError from 'components/Error';
import getRenderer from 'helpers/contentRenderer';

type Props = {
  author: string,
  permlink: string
}

export const ContentDetailsPage = ({ author, permlink }: Props) => {
  const dispatch = useDispatch();
  const [renderer, setRenderer] = useState<any>(null);

  const {
    content,
    error: contentError,
    isLoading
  } = useSelector((state: RootState) => state.content);

  useEffect(() => {
    dispatch(fetchContent(author, permlink));
  }, [dispatch]);

  useEffect(() => {
    getRenderer().then(setRenderer).catch(console.error);
  }, []);

  if (contentError) {
    return (
      <AppError />
    )
  };

  let renderContent = isLoading || !renderer ? (
    <Skeleton count={5} height={30} duration={3} />
  ) : (
    renderHTML(renderer.render(content.body))
    );

  return (
    <>
      {renderContent}
    </>
  );
}
