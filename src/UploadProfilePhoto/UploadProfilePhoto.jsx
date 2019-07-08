import React, { Component } from "react"
import styled, { keyframes } from "styled-components"
import PropTypes from "prop-types"
import Dropzone from "react-dropzone"
import ProfilePhoto from "./ProfilePhoto"
import MenuHolder from "./DropRightMenu"
/*
  This is the main file for this simple image upload. To open the menu,
  please change the prop for whether or not the menu is visble.
  Size just changes the size of the displayed profile image. 

  cancelButtonHandler: PropTypes.func,  This controls what happens when we click cancel. 
  showMenu: PropTypes.bool, 
  image: PropTypes.node.isRequired,
  size:PropTypes.number,



*/

class UploadProfilePhoto extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      userDraggingPreview: false,
      dragImg: null, //This is just used to get rid of the ghost
      // ******** Initial Image Width and Height
      imgWidth: 0,
      imgHeight: 0,
      // **********
      minSize: 200,
      // ***** This is the size of the preview image
      rangeRatio: 100,
      // ***** This is just used for zooming in and out.
      previewMinValue: 0,
      previewMaxValue: 0,

      previewWidth: 0,
      previewHeight: 0,
      previewPosX: 0,
      previewPosY: 0,
      //**** These properties are used for the preview image position and scale only.
      maxXTrans: undefined,
      maxYTrans: undefined,
      // Used for setting the max Transformation
      initialMousePosX: 0,
      initialMousePosY: 0,
      //**** This is the mouse position during a drag event.

      file: null,
      fileURL: null,
      //**** This is where we are saving our image file.

      value: 0,
      previewVisible: false,

      // Whether or not to show the menu 
      isMenuVisible:false,
    }
    this.timer = null
    this.checkResize = this.checkResize.bind(this)
    this.handleImageDrag = this.handleImageDrag.bind(this)
    this.handleImageDragStart = this.handleImageDragStart.bind(this)
    this.handleSliderChange = this.handleSliderChange.bind(this)
    this.debounce = this.debounce.bind(this)
    this.acceptButtonHandler = this.acceptButtonHandler.bind(this)
  }
  menuToggler = () =>{
    this.setState({
      isMenuVisible: !this.state.isMenuVisible,
    })
  }

  componentDidMount() {
    this.dragImg = new Image(0, 0)
    this.dragImg.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
  }
 
  componentWillUnmount() {}

  overrideEventDefaults = e => {
    e.preventDefault()
    e.stopPropagation()
  }

  acceptButtonHandler(){
    var ImageSrc = new Image()
    ImageSrc.style.display = "none"

    ImageSrc.src = this.state.fileURL
    ImageSrc.width = this.state.imgWidth
    ImageSrc.height = this.state.imgHeight
   
    ImageSrc.onload = async () => {
      var crop_canvas = document.createElement("canvas")
      crop_canvas.style.display = "hidden"
      crop_canvas.getContext("2d", { alpha: false })

      crop_canvas.imageSmoothingEnabled = true
      crop_canvas.imageSmoothingQuality = "high"

      var qualityRatio = 2.0
      crop_canvas.width = this.state.minSize * qualityRatio
      crop_canvas.height = this.state.minSize * qualityRatio

      var left =
        (this.state.previewWidth / 2 -
          this.state.minSize / 2 -
          this.state.previewPosX) *
        qualityRatio
      var top =
        (this.state.previewHeight / 2 -
          this.state.minSize / 2 -
          this.state.previewPosY) *
        qualityRatio

      // First resize our image

      crop_canvas
        .getContext("2d")
        .drawImage(
          ImageSrc,
          -left,
          -top,
          Math.round(this.state.previewWidth * qualityRatio),
          Math.round(this.state.previewHeight * qualityRatio)
        )

      // First lets make our data file.
      let data = await crop_canvas.toDataURL()
      // Get the inital file name
      var fileName = this.state.file.name
      // Set the appropiate file extension
      if (fileName.substr(0, fileName.lastIndexOf(".")) === "") {
        // this means there is no extension
        fileName = fileName + ".png"
      } else {
        // there is an extension.
        fileName = fileName.substr(0, fileName.lastIndexOf(".")) + ".png"
      }

      var dataurl = data
      // Begin creating the new PNG file.
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }

      // TODO Here is where the backend work needs to be added. 


      // Here is the file that will be pushed to the back end!!
      var ourPNGfile = await new File([u8arr], fileName, { type: mime })
      // Here is our new PNG file with the new filename as well.



     
      /*
      // Use only for demo or testing purposes. 
      var win = window.open()
      win.document.write(
        '<iframe src="' +
          URL.createObjectURL(ourPNGfile) +
          '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>'
      )
        */
    }
   
  }

  componentDidUpdate() {
    clearTimeout(this.timer)
  }
  setInitialSize = () => {
    if (this.state.fileURL !== null) {
      var img = new Image()

      img.src = this.state.fileURL

      img.onload = () => {
        // image  has been loaded
        var minH = img.height
        var minW = img.width

        if (img.height !== 0 && img.width !== 0) {
          if (minH < this.state.minSize) {
            minH = minH + (this.state.minSize - img.height) // imgH + (visible gap)
            minW = minH
            if (minW < this.state.minSize) {
              minW = minW + (this.state.minSize - minW) // minW + (visible gap)
            }
          }
          // We need to know what ratio we can set the
          // slider at.

          var ratioH = this.state.minSize - minH
          var ratioW = this.state.minSize - minW
          var minValue = 0
          if (ratioW > ratioH) {
            // the gap is bigger on W side
            // Minimum Ratio =  minSize/imgsize ex: 44/44=1
            // becuase the gap is bigger on Width side...

            minValue = this.state.minSize / img.width
          } else if (ratioH > ratioW) {
            // the gap is bigger on H side

            minValue = this.state.minSize / img.height
          } else {
            // It must be a square image ...
            // so it can be either one.

            minValue = this.state.minSize / img.height
          }

          var MaxVal = minValue * 5 // three times the size

          minValue = Math.round(minValue * this.state.rangeRatio) // because the scale of the range slider
          MaxVal = Math.round(MaxVal * this.state.rangeRatio)

          this.setState({
            isLoading: false,
            imgWidth: img.width,
            imgHeight: img.height,
            previewWidth: img.width * (minValue / 100),
            previewHeight: img.height * (minValue / 100),
            previewVisible: true,
            previewMinValue: minValue,
            previewMaxValue: MaxVal,
            value: minValue,
          })
        }
      }
    }
  }

  HandleFileDrop = file => {
    if (this.state.fileURL != null) {
      URL.revokeObjectURL(this.state.fileURL)
    }
    this.setState({
      isLoading: true,
    })
    let reader = new FileReader()
    reader.onloadend = () => {
      this.setState(
        {
          file: file[0],
          fileURL: reader.result,
        },
        function() {
          if (this.state.fileURL !== null) {
            this.resetParams()
          }
          this.setInitialSize()
        }
      )
    }
    reader.readAsDataURL(file[0])
  }

  handleDragOut = e => {
    e.preventDefault()
  }

  handleSliderChange = this.debounce(value => {
    var newValue = value
    var pWidth = Math.round(this.state.imgWidth * (newValue / 100))
    var pHeight = Math.round(this.state.imgHeight * (newValue / 100))

    var radius = this.state.minSize / 2
    var maxXT = Math.floor(pWidth / 2 - radius)
    var maxYT = Math.floor(pHeight / 2 - radius)
    this.setState(
      {
        value: newValue,
        previewWidth: pWidth,
        previewHeight: pHeight,
        maxXTrans: maxXT,
        maxYTrans: maxYT,
      },
      function() {
        this.checkResize()
      }
    )
  }, 2)
  handleImageDragStart(event) {
    event.dataTransfer.setData("text/plain", null)
    event.dataTransfer.setDragImage(this.dragImg, 0, 0)
    document.body.style.cursor = "default"
    this.setState({
      userDraggingPreview: true,
      initialMousePosX: event.clientX,
      initialMousePosY: event.clientY,
    })
  }
  checkResize() {
    var radius = this.state.minSize / 2
    var maxXTrans = Math.floor(this.state.previewWidth / 2.0 - radius)
    var maxYTrans = Math.floor(this.state.previewHeight / 2.0 - radius)

    var newX = this.state.previewPosX
    var newY = this.state.previewPosY
    if (this.state.previewPosX >= maxXTrans) {
      newX = maxXTrans
    }
    if (this.state.previewPosX <= -1 * maxXTrans) {
      newX = -1 * maxXTrans
    }
    if (this.state.previewPosY >= maxYTrans) {
      newY = maxYTrans
    }
    if (this.state.previewPosY <= -1 * maxYTrans) {
      newY = -1 * maxYTrans
    }
    if(this.state.previewPosX!== newX || this.state.previewPosY !== newY){
      this.setState({
        previewPosX: newX,
        previewPosY: newY,
      })
    }
  
  }

  handleImageDrag = this.debounce((clientX, clientY) => {
    var originX = this.state.initialMousePosX
    var originY = this.state.initialMousePosY
    var maxXTrans = 0
    var maxYTrans = 0
    if (
      this.state.maxXTrans === undefined ||
      this.state.maxYTrans === undefined
    ) {
      var radius = this.state.minSize / 2
      var maxXT = this.state.previewWidth / 2 - radius
      var maxYT = this.state.previewHeight / 2 - radius

      this.setState(
        {
          maxXTrans: Math.floor(maxXT),
          maxYTrans: Math.floor(maxYT),
        },
        () => {
          maxXTrans = this.state.maxXTrans
          maxYTrans = this.state.maxYTrans
        }
      )
    } else {
      maxXTrans = this.state.maxXTrans
      maxYTrans = this.state.maxYTrans
      //  console.log("maxXT", maxXTrans)
    }

    var MouseAccel = 1.0

    var MouseX = clientX

    var MouseY = clientY
    var imgX = 0
    var imgY = 0
    var previewMoveX =
      (this.state.previewPosX + (MouseX - originX)) * MouseAccel
    var previewMoveY =
      (this.state.previewPosY + (MouseY - originY)) * MouseAccel
    if (-1 * maxXTrans <= previewMoveX && previewMoveX <= maxXTrans) {
      imgX = this.state.previewPosX + (MouseX - originX)
    } else {
      imgX = this.state.previewPosX
    }
    if (-1 * maxYTrans <= previewMoveY && previewMoveY <= maxYTrans) {
      imgY = this.state.previewPosY + (MouseY - originY)
    } else {
      imgY = this.state.previewPosY
    }

    if (this.state.previewPosX !== imgX || this.state.previewPosY !== imgY) {
      this.setState({
        previewPosX: imgX,
        previewPosY: imgY,
        initialMousePosX: MouseX,
        initialMousePosY: MouseY,
      })
    }
  }, 5)
  debounce(func, wait, immediate) {
    var timeout
    return function() {
      var context = this,
        args = arguments
      var later = function() {
        timeout = null
        if (!immediate) func.apply(context, args)
      }
      var callNow = immediate && !timeout
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
      if (callNow) func.apply(context, args)
    }
  }
  resetParams = () => {
    this.setState({
      previewPosX: 0,
      previewPosY: 0,
      //**** These properties are used for the preview image position and scale only.

      //
      initialMousePosX: 0,
      initialMousePosY: 0,
      //**** This is the mouse position during a drag event.

      maxXTrans: undefined,
      maxYTrans: undefined,
    })
  }

  render() {
    try {
      return (
        <Container>
          <ProfilePhoto onClick={this.menuToggler} imageSrc={this.props.image} size={this.props.size} />
          <MenuHolder onMenuClose={this.cancelButtonHandler} padding="19px" isVisible={this.state.isMenuVisible}>
            <UploadBoxContainer>
              <HeaderText>Choose Photo</HeaderText>
              <UploadCircle>
                <Dropzone
                  accept="image/png, image/jpeg"
                  multiple={false}
                  noClick={false}
                  preventDropOnDocument={true}
                  disabled={
                    this.state.userDraggingPreview === true ? true : false
                  }
                  maxSize={5242880}
                  noDragEventsBubbling={true}
                  onDropAccepted={this.HandleFileDrop}
                >
                  {({ getRootProps, getInputProps, isDragActive }) => (
                    <DropContainer>
                      <InnerCircleText {...getRootProps()}>
                        <CustomInput {...getInputProps()} />
                        {isDragActive && this.state.previewWidth !== 0
                          ? ""
                          : "Upload or Drag Photo Here"}
                      </InnerCircleText>
                      <ImagePreview
                        {...getRootProps()}
                        src={this.state.fileURL}
                        draggable={true}
                        onDragStart={this.handleImageDragStart}
                        onDragCapture={event =>
                          this.handleImageDrag(event.clientX, event.clientY)
                        }
                        onDragEnd={() => {
                          document.body.style.cursor = "auto"
                          this.timer = setTimeout(() => {
                            this.setState({
                              userDraggingPreview: false,
                            })
                          }, 1000)
                        }}
                        onDragOver={e => {
                          e.preventDefault()
                        }}
                        style={{
                          filter:
                            this.state.isLoading === true ? "blur(2px)" : "",
                          width: this.state.previewWidth,
                          height: this.state.previewHeight,
                          zIndex: isDragActive ? -1 : 2,
                          transform:
                            `translate(` +
                            `${this.state.previewPosX}` +
                            `px,` +
                            `${this.state.previewPosY}` +
                            `px)`,
                        }}
                      />
                    </DropContainer>
                  )}
                </Dropzone>
              </UploadCircle>
            </UploadBoxContainer>
            <SizeSelector
              type="range"
              min={this.state.previewMinValue}
              onChange={event => this.handleSliderChange(event.target.value)}
              max={this.state.previewMaxValue}
              steps="any"
              value={this.state.value}
            />
            <ButtonContainer>
              <MenuButton
                className="cancel"
                onClick={this.props.cancelButtonHandler}
              >
                Cancel
              </MenuButton>
              <MenuButton onClick={this.acceptButtonHandler}>Accept</MenuButton>
            </ButtonContainer>
          </MenuHolder>
        </Container>
      )
    } catch (e) {
      if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
        console.log(e)
      }
      return null
    }
  }
}

UploadProfilePhoto.propTypes = {
  cancelButtonHandler: PropTypes.func,
  showMenu: PropTypes.bool,
  image: PropTypes.node.isRequired,
  size: PropTypes.number,
}
// Set the default props that will be used
// Notice we are testing if the browser is supported or else we have to use polling.

UploadProfilePhoto.defaultProps = {
  cancelButtonHandler: function() {},
  showMenu: false,
  size: 100,
}
const FadeIn = keyframes`
from {
 

  opacity: 0;
} 
to {
 

  opacity: 1;
}`
const SizeSelector = styled.input`
  width: 100%;
  margin: 0.4em 0;
`
const CustomInput = styled.input`
  cursor: auto !important;
  
`
const DropContainer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  overflow: hidden !important;
  z-index: 2;
  flex-direction: row;
  justify-content: center;
  align-content: center;
  vertical-align: center;
  align-items: center;
`
const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  vertical-align: center;
  justify-content: center;
  position: relative;
  /* text properties */
  line-height: 1em;
  letter-spacing: 0.004em;
`
const ImagePreview = styled.img`
  max-width: none;
  max-height: none;
  z-index:2;
  transform-origin: center;
  outline: none;
  position: absolute;
  transition-property: width, height;
  transition-duration: 0.16s;
  transition-delay: 0s;
  overflow: hidden;
  transition-timing-function: linear;
  animation: ${FadeIn} 0.15s ease-in;
`
const UploadBoxContainer = styled.div`
  position: relative;
  overflow: hidden important!;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: space-between;
  align-items: center;
`

// This is for the outline of our Image Preview
const UploadCircle = styled.div`
  border-style: solid;
  border-radius: 50%;
  border-width: 2px;
  border-color: rgba(0, 0, 0, 0.3);
  box-shadow: 0 1.5px 3px 0 rgba(0, 0, 0, 0.15),
    0 1.5px 3px 0 rgba(0, 0, 0, 0.15);

  height: 200px;
  width: 200px;
  overflow: hidden !important;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: center;
  vertical-align: center;
  align-items: center;
  position: relative;
  cursor: default !important;
`
const InnerCircleText = styled.p`
  line-height:1.4em;
  text-align: center;
  position: absolute;
  outline: none !important;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
`
const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  margin-top: 0.8em;
  margin-bottom: 0.1em;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  align-content: center;
`
const MenuButton = styled.button`
  -webkit-box-align: center;
  align-items: center;
  border: 0;
  cursor: pointer;
  justify-content: center;
  padding-left: 18px;
  padding-right: 18px;
  flex-grow: 0;
  -webkit-box-pack: center;
  display: flex;
  line-height: 1.8em;
  border-radius: 2px;
  font-size: 16px !important;
  font-weight: 500 !important;
  border: 0px solid black;
  outline: none;
  max-height: 32px !important;
  min-width: 120px;
  margin-left: 10px !important;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;

  color: ${props => (props.textcolor ? props.textcolor : "#000")};

  &.cancel {
    color: black;
    background-color: transparent;
    border-color: transparent;
  }
  background-color: ${props =>
    props.color ? props.color : "rgb(255, 236, 6);"};

  :active {
    outline: none;
    transition: all 0.3s ease 0s;
    transform: scale(0.95);
  }
  :disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`
const HeaderText = styled.p`
  font-weight: 100;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 1.1em;
`

export default UploadProfilePhoto
