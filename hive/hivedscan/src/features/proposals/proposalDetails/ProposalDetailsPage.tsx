import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'app/store/rootReducer';
import renderHTML from 'react-render-html';
import Skeleton from 'react-loading-skeleton';
import AppError from 'components/Error';
import getRenderer from 'helpers/contentRenderer';
import { fetchProposal } from './proposalDetailsSlice';
import { useParams } from "react-router-dom";
import { Container } from "reactstrap";

export const ProposalDetailsPage = () => {
  const dispatch = useDispatch();
  let { id } = useParams();
  const [renderer, setRenderer] = useState<any>(null);

  const {
    proposal,
    content,
    proposalError,
    isLoading
  } = useSelector((state: RootState) => state.proposal);

  useEffect(() => {
    dispatch(fetchProposal(Number(id)));
  }, [dispatch]);

  useEffect(() => {
    getRenderer().then(setRenderer).catch(console.error);
  }, []);

  if (proposalError) {
    return (
      <AppError />
    )
  };

  let renderProposal = isLoading && !proposalError ? (
    <Skeleton count={5} height={30} duration={3} />
  ) : (
      <>
        <h3>{proposal.subject} ({proposal.id})</h3>
      </>
    );

  let renderContent = isLoading || !renderer ? (
    <Skeleton count={5} height={30} duration={3} />
  ) : (
      <>
        {renderHTML(renderer.render(content.body))}
      </>
    );

  return (
    <Container className="my-5 py-5 bg-white">
      {renderProposal}
      {renderContent}
    </Container>
  );
}
