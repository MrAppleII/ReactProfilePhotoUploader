import React, { Component } from "react";
import styled from "styled-components"
/*

    This the little profile photo that shows up in the corner of the comments. 

*/
class ProfilePhoto extends Component {
  constructor(props) {
    super(props)
    this.state = {
      EditVisibility:"hidden",
    }
  }
  MouseEntered=() =>{
    this.setState({
      EditVisibility:"visible",
    })
  }
  MouseLeft = () =>{
    this.setState({
      EditVisibility:"hidden",
    })
  }

  render() {
    return (
       <Wrapper>
          < Photo 
          onMouseEnter ={this.MouseEntered}
          onMouseLeave={this.MouseLeft}
        onClick={this.props.onClick}
          src={this.props.imageSrc}
          width={this.props.size}
          height={this.props.size}
          alt="Oops."
        />
        <EditText style={{visibility:`${this.state.EditVisibility}`}}>
          Edit
        </EditText>
      
       </Wrapper>
       
       
    );
  }

  
}

const Wrapper = styled.div`
position:relative;
display:flex;
flex-direction:column;
margin-bottom:auto;
margin-top:auto;
align-self:center;
overflow:hidden !important;
border-radius: 50%;
border-style: solid;
  
  border-width: 2px;
  border-color: rgba(0, 0, 0, 0.3);
  box-shadow: 0 1.5px 3px 0 rgba(0, 0, 0, 0.15),
    0 1.5px 3px 0 rgba(0, 0, 0, 0.15);

`


const Photo = styled.img`
position:relative;


margin-bottom:auto;
margin-top:auto;
align-self:center;
z-index:0!important;

cursor: pointer;


`
const EditText = styled.div`
position:absolute;
bottom:0;
width:100%;
text-align:center;
color:white;
background-color: rgba(0,0,0,0.4);
line-height:1em;
padding:0.1em;
cursor: pointer;
pointer-events:none;
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  
`

export default ProfilePhoto;
