import React from "react";
import UploadImage from "SRC/components/popupComponent/overview/UploadImage.jsx";
import styled from "styled-components";
const OverviewContainer = styled.div`
  .UploadImage{
    margin:20px;
  }
`;
export default class Overview extends React.Component{

  render(){
    return(
       <OverviewContainer>
         <div className ="UploadImage">
          <UploadImage/>
         </div>
       </OverviewContainer>
        
    )
  }
}