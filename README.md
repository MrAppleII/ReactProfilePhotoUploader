# ReactProfilePhotoUploader

The file to import just UploadProfilePhoto.jsx

The other files are just there to support it. The only prop that needs to be passed is an image Node that will be the user's 
current profile image. I have provided an example below of how it is imported. 

```
<ProfileUploader  image={userImage} >

```

Also, the backend work needs to be added here in UploadProfilePhoto.jsx at line 159

```
  // TODO Here is where the backend work needs to be added. 


      // Here is the file that will be pushed to the back end!!
      var ourPNGfile = await new File([u8arr], fileName, { type: mime })
      // Here is our new PNG file with the new filename as well.


```
