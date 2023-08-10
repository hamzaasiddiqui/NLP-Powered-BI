import React from 'react';

export default function Chart(props) {
  const handleBack = () => {
    // Implement your logic here for going back
    console.log('Going back...');
  };

  const markdown = props.data.markdown;

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: markdown }} />
      <div>
        <button onClick={handleBack}>Back</button>
      </div>
    </div>
  );
}