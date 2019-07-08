import React, { Component } from "react"
import styled, { keyframes } from "styled-components"
import PropTypes from "prop-types"

/*
    File: DropdownMenu.js
    Description: Just a dropdown menu that can will display under a component. However, it is ESSENTIAL it is 
    right below the component you want it to belong to. It will automagically reposition itself in the browser window. 

    Props:
    props.maxHeight sets the max height for the menu
    props.height Sets the height for the menu.
    props.width Sets the width for the menu.
    props.isVisible Sets the visibilty of the menu!
    this.props.onMenuClose()
*/
class DropdownMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      classProp: "show",
      isFadedOut: false,
      isFirstRun: true,
      windowWidth: null,
      windowHeight: null,
      menuYTranslate:0,
      menuWidth: null,
      menuTranslate: -(this.props.width/2),
    }
    this.menuWindow = React.createRef()
    
  }
  componentDidMount() {
    
    window.addEventListener("resize", this.handleResize)

   

  }
  //***************************
  checkOutsideHandle = (e) =>{
    if(this.menuWindow.current!=null){
    if (!this.menuWindow.current.contains(e.target)&&this.menuWindow) {
      if(this.props.isVisible){
        this.props.onMenuClose()
    
      }  
    }
    }
  }
  //***************************
  componentWillUnmount() {

    window.removeEventListener("resize", this.handleResize)
  }
  handleResize = event =>{
    try{
      if (this.menuWindow.current != null) {
        this.setState({
          isFirstRun: true,
        })
        this.checkTranslate();
        this.setState({
          isFirstRun: false,
        })
      }
    }catch(e){
  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
        console.log(e)
      
    }}
  
  }

  checkTranslate = () => {
   // Add this for mouse events

    try{
      if (this.state.isFirstRun) {
        var mWidth =
          this.menuWindow.current.getBoundingClientRect().right -
          this.menuWindow.current.getBoundingClientRect().left
        this.setState({
          windowWidth: window.innerWidth,
          windowHeight: window.innerHeight,
          menuTranslate: -1 * (mWidth / 2),
        })

        var mHeight = this.menuWindow.current.scrollHeight
       
        if(this.state.menuYTranslate === 0 || this.state.menuYTranslate!==mHeight){
          // console.log(this.menuWindow.current.scrollHeight)
         this.setState({
             menuYTranslate:-1*(this.menuWindow.current.scrollHeight),
            })
        }

        var rightSideDistance = ~~(
          window.innerWidth -
          this.menuWindow.current.getBoundingClientRect().right
        )
        var leftSideDistance = this.menuWindow.current.getBoundingClientRect()
          .left

        if (rightSideDistance <= 20.0 && leftSideDistance <= 20) {
          if (rightSideDistance < leftSideDistance) {
            this.setState({
              menuTranslate: -1 * mWidth + 20,
            })
          } else {
            this.setState({
              menuTranslate: -1 * (mWidth / 2),
            })
          }
        }
        if (rightSideDistance <= 20.0) {
          this.setState({
            menuTranslate: -1 * mWidth + 20,
          })
        } else if (leftSideDistance <= 20) {
          this.setState({
            menuTranslate: 1 * -20,
          })
        } else {
          this.setState({
            menuTranslate: -1 * (mWidth / 2),
          })
        }
      }
    }catch(e){
      if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
            console.log(e)
          
        }}
  }

  ChangeFirstRun = () => {
    //***************************
    this.AddListener()
    //***************************
    this.setState({
      isFirstRun: false,
    })
  }
  //***************************
  AddListener = () =>{
       window.addEventListener('click', this.checkOutsideHandle, false);

  }
  RemoveListener = () =>{
    window.removeEventListener('click', this.checkOutsideHandle, false);

  }
//***************************
  render() {
    try {
      return this.props.isVisible ? (
        <Wrapper
          onAnimationStart={this.checkTranslate}
          onAnimationEnd={this.ChangeFirstRun}
          style={{ visibility: "show" }}
          className="show"
          
        >
          <TriangleTop 
          //***************************
          onClick={e => {
            // We are simply preventing the e based function up above from misfiring
            e.stopPropagation()
          
          }}
          style={{
             
         zIndex:1,
        }}
/>
          <MainContainer
          //***************************
          onClick={e => {
            // We are simply preventing the e based function up above from misfiring
            e.stopPropagation()
          }}
          //***************************
          padding={this.props.padding}
            ref={this.menuWindow}
            style={{
               
                transform:" translateX(50%) translateX(17px) ",
              width:""+this.props.width+"px",
              top:""+(this.state.menuYTranslate/2)+"px",
            }}
          >
            <InnerChildContainer>{this.props.children}</InnerChildContainer>
          </MainContainer>
          
        </Wrapper>

      ) : !this.state.isFirstRun ? (
        <Wrapper className="hide"  
        //***************************
         onAnimationEnd={this.RemoveListener}
         //***************************
         >
          <TriangleTop />
          <MainContainer
           padding={this.props.padding}
            style={{
                transform:" translateX(50%) translateX(17px) ",
                width:""+this.props.width+"px",
                top:""+(this.state.menuYTranslate/2)+"px",
            }}
          >
            <InnerChildContainer>{this.props.children}</InnerChildContainer>
          </MainContainer>
        </Wrapper>
      ) : null
    } catch (e) {
      if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
        console.log(e)
      }
      return null
    }
  }
}
export default DropdownMenu

const FadeIn = keyframes`
from {
  transform-style: preserve-3d;
  transform-origin: 0px 0px;
  transform:  translateX(50%);

  opacity: 0;
} 
to {
  transform-style: preserve-3d;
  transform-origin: 0px 0px;
  
  transform:    translateX(50%);

  opacity: 1;
}
`
const FadeOut = keyframes`
from {
  transform-style: preserve-3d;
  transform-origin: 0px 0px;
  transform:  translateX(-50%);


  visibility: visible;
  opacity: 1;
} 
to {
  transform-style: preserve-3d;
  transform-origin: 0px 0px;
  transform:  translateX(-50%);


  opacity: 0;
  
}
`

const MainContainer = styled.div`
  position: absolute;
  
  /* Shadows */
  /* Background */
  background-color: ${props => props.containerColor || "white"};

  /* Dimensions */
  height: ${props => props.height || ""};

  max-height: ${props => props.maxHeight || ""};
  max-width: ${props => props.maxWidth || ""};

  

 /* width: ${props => `"`+props.width+`px` || "390px"}; */
  
  transform-origin: 0% 0%;
  will-change: transform, opacity;


  border-radius: 2px;

  /* Item Alignment */
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  vertical-align: baseline;
  justify-content: center;

  /* Padding */
  padding:  ${props => props.padding || "20px"};;

  /* Fonts */
  font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  color: #000;
`
const Wrapper = styled.div`
position:relative;
/* positioning */
filter: drop-shadow( 1.5px 1.5px 2px rgba(0, 0, 0, 0.45));





margin-bottom:auto;
margin-top:auto;
/* Visibility */
visibility: hidden;


display:flex;
flex-direction:row;
justify-content:center;
align-items:center;
vertical-align:baseline;


height:0;
z-index:500;
width:0;
will-change: transform, opacity;

/* Animations :D */
&.show {
  
  visibility: visible !important;
  animation: ${FadeIn} 0.15s ease-in;
}
&.hide {
  animation: ${FadeOut} 0.15s ease-in;
}

`
const InnerChildContainer = styled.div`
 position: relative;
  align-items: center;
  flex: 1;
  vertical-align: baseline;



`

const TriangleTop = styled.div`
  /* dimensions */
  width: 25px;
  height: 25px;
 

  background: ${props => props.containerColor || "white"};

  /* transforms */
  transform-origin: center;
  transform: translateX(25%)  translateY(50%)  rotate(45deg) ;
  


  will-change: transform, opacity;

  /* positioning */
  position: absolute;
  z-index: 1;
  left: 0;
  bottom:0;
  right: auto;
 

  /* Borders */
  border-radius: 1px;

  /*shadows*/
  box-shadow: 0 50px 100px -20px rgba(50, 50, 93, 0.25),
    0 30px 60px -30px rgba(0, 0, 0, 0.3),
    0 -18px 60px -10px rgba(0, 0, 0, 0.025);
`

DropdownMenu.propTypes = {
  height: PropTypes.string,
  width: PropTypes.number,
  isVisible: PropTypes.bool,
  onMenuClose: PropTypes.func,
  padding: PropTypes.string,
}
DropdownMenu.defaultProps = {
  isVisible: false,
  width:290,
  
  // ***************************
  onMenuClose: function(){}
  //*************************** */
}
