const handlePrevious = () => {
  if (paginationIndex !== 0) {
    const content = currentTimeline[paginationIndex - 1];
    const {title, body} = content;
    setContent({
      title,
      body
    });
    setPaginationIndex (paginationIndex - 1);
  }
}

const handleNext = () => {
  if (paginationIndex < currentTimeline.length - 1) {
    const content = currentTimeline[paginationIndex + 1];
    const {title, body} = content;
    setContent({
      title,
      body
    });
    setPaginationIndex (paginationIndex + 1);
  }
}