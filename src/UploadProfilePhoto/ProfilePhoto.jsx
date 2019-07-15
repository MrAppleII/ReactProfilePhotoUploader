import React, { Component } from "react"
import styled from "styled-components"
import defaultProfileAvatar from "../../images/userDemo/defaultavatar.png"
/*

    This the little profile photo that shows up in the corner of the comments. 

*/

class ProfilePhoto extends Component {
  constructor(props) {
    super(props)
    this.state = {
      EditVisibility: "hidden",
    }
    this.handleError = this.handleError.bind(this)
  }

  handleError(event) {
    console.log("Avatar error", event)
  }
  MouseEntered = () => {
    this.setState({
      EditVisibility: "visible",
    })
  }
  MouseLeft = () => {
    this.setState({
      EditVisibility: "hidden",
    })
  }

  render() {
    return (
      <Wrapper>
        <Photo
          onMouseEnter={this.MouseEntered}
          onMouseLeave={this.MouseLeft}
          onClick={this.props.onClick}
          src={this.props.imageSrc ? this.props.imageSrc : defaultProfileAvatar}
          width={this.props.size}
          height={this.props.size}
          onError={this.handleError}
        />
        <EditText style={{ visibility: `${this.state.EditVisibility}` }}>
          Edit
        </EditText>
      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  margin-bottom: auto;
  margin-top: auto;
  align-self: center;
  overflow: hidden !important;
  border-radius: 50%;
  border-style: solid;

  border-width: 0px;
  border-color: rgba(0, 0, 0, 0.3);
`

const Photo = styled.img`
  position: relative;

  margin-bottom: auto;
  margin-top: auto;
  align-self: center;
  z-index: 0 !important;

  cursor: pointer;
`
const EditText = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: white;
  background-color: rgba(0, 0, 0, 0.4);
  line-height: 1em;
  padding: 0.1em;
  cursor: pointer;
  pointer-events: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
`

export default ProfilePhoto
