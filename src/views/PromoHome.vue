<template>
  <div class="home">    
    <div>
            <!-- <div class="row justify-content-center">
                <div class="col-12 col-md-6">
                    <FunGrid />

                </div>
                <div class="col-12 col-md-6 fungrid2">
                    <FunGrid />

                </div>                
            </div> -->
            <div class="row justify-content-center px-md-5 my-md-5 d-flex">
                <div class="col-12 col-lg-6 mb-4 order-2 order-lg-1">  
                    <h2 class="h1 display-5"><strong>Small Archives</strong></h2> 

                    <p class="lead my-4">A simple platform for publishing collections of stuff on the web.</p>
                    <p>Create collections of images, audio, video and text, add metadata, location, and tags, then share (or don't?).</p>
                    <p><a class="btn btn-primary btn-lg" href="/sign-up">Sign Up</a></p>
                    <small><a href="/demo">View Demo</a></small>

                </div>

                <div class="col-12 col-lg-6 mb-4 float-right order-1 order-lg-2">   
                    <FunGrid />
                    <!-- <div class="card">
                        <div class="card-body p-0 text-center">
                            <p></p>
                            <a class="btn btn-primary btn-lg" href="/sign-up">Sign Up</a>
                        </div>
                    </div>           -->
                </div>
            </div> 
            <div class="row justify-content-center px-md-5 py-5 ">
                <div class="col-12 col-lg-6 mb-4 pr-5">  
                    <h3>Free for now</h3> 

                    <p>We are still in active development, and so everything is free for now. Someday, if all goes well, we might charge a small fee or make an "enterprise edition" or something like this. In the meantime, please enjoy, and provide us with any and all feedback that you have.</p>
     

                </div>
                <div class="col-12 col-lg-6 newsletter"> 
                    
                    <div class="card bg-transparent">
                        <div class="card-body p-0" >
                            <h3>Newsletter</h3> 
                            <p>Receive periodic updates about our service. So far, we have sent zero updates, but maybe someday.</p>
                            <form class="form-inline mb-5" action="https://tinyletter.com/smallarchives" method="post" target="popupwindow" onsubmit="window.open('https://tinyletter.com/smallarchives', 'popupwindow', 'scrollbars=yes,width=800,height=600');return true">
                                <div class="form-group mb-2">
                                    <label for="tlemail" class="sr-only">Email address</label>
                                    <input type="text" name="email" id="tlemail" placeholder="Email address" class="form-control mr-sm-2" />
                                    <input type="hidden" value="1" name="embed"/><br />
                                    <input type="submit" value="Sign Up" class="btn-dark btn" />
                                </div>
                            </form> 
                            <font-awesome-icon class="float-left pr-2" :icon="['fab', 'twitter']" size="2x" />
                            <p>Or follow our progress on twitter <a href="https://twitter.com/smallarchives">@smallarchives</a>.</p>
                        </div>
                    </div>          
                </div>
            </div>             
            <div class="row my-5 py-5 px-md-5 justify-content-center cards-row">
                <div class="col-12 col-xl-10">
                    <div class="card-deck">

                      <div class="card">
                        <!-- <p class="text-center mt-4"><font-awesome-icon class="text-center" icon="file-image" size="3x" /></p> -->
                        <div class="card-body text-center">
                          <MediaTypesAnimation class="mb-4" />
                          <h3 class="card-title text-left">Multi-media</h3>
                          <p class="card-text text-left">Add images, audio, PDFs, and youtube videos (and more to come). Visitors can view all media in-browser, no downloading required!</p>
                        </div>
                      </div>
                      <div class="card">
                        <!-- <p class="text-center mt-4"><font-awesome-icon class="text-center" icon="archive" size="3x" /></p> -->
                        <div class="card-body text-center">
                          <MetadataAnimation class="mb-4"/>
                          <h3 class="card-title text-left">Metadata</h3>
                          <p class="card-text text-left">Small Archives uses default Dublin Core Metatdata fields, with a few minor modifications. Input forms have handy tips for those less familiar with what all the terms mean.</p>
                        </div>
                      </div>
                      <div class="card">
                        <!-- <p class="text-center mt-4"><font-awesome-icon class="text-center" icon="university" size="3x" /></p> -->
                        <div class="card-body text-center">
                            <AaasAnimation class="mb-4" /> 
                            <h3 class="card-title text-left">A-a-a-S</h3>
                            <p class="card-text text-left">Small Archives is Archives-as-a-Service. No need to set anything up or host anything. Just sign up and get started.</p>
                        </div>
                      </div>                      
                    </div>                    
                </div>             
            </div>              
            <div class="row px-sm-5 justify-content-center example-row">
                <div class="col-12 col-lg-6">
                    <h2 class="h2">View a demo</h2>
                    <p>View an example of a small archive with our demo collection.</p>
                    <p><a href="/demo" class="btn btn-primary">See Example</a></p>                    
                </div>                 
                <div class="col-12 col-lg-6 p-0">
                    <a href="/demo">
                        <img class="img-link" src="img/demo-screenshot.png" />     
                    </a>                    
                </div>   
            </div>               

            <div class="row my-5 px-sm-5 justify-content-center">
                <div class="col-12">
                    <h3>Questions, comments, concerns?</h3>
                     <ul class="list-unstyled my-4">
                        <li><strong>Email:</strong> smallarchives at gmail dot com</li>
                        <li><strong>Twitter:</strong> @smallarchives</li>
                        <li><strong>Instagram:</strong> @smallarchives</li>
                    </ul>                    
                </div>             
            </div>                                                     

	</div>


  </div>
</template>


<script>

import FunGrid from '../components/FunGrid'
import MarbleAnimation from '../components/MarbleAnimation'
import MediaTypesAnimation from '../components/MediaTypesAnimation'
import AaasAnimation from '../components/AaasAnimation'
import MetadataAnimation from '../components/MetadataAnimation'



export default {
  name: 'PublicHome',
  components: {
    FunGrid ,
    MarbleAnimation,
    MediaTypesAnimation,
    AaasAnimation,
    MetadataAnimation
  },
}
</script>

<style scoped lang="scss">


    .card {
        border: 0px;
        background-color: transparent;
    }

    .row {
        border-bottom: 1px solid lightgrey;
    }


    .lead {
        font-size: 1.6em;
        line-height: 1.4em;
    }

    .service-illo {
        height: 200px;
        margin: 0 auto;
        display: block;
        margin-bottom: 20px;
        max-width: 100%;
    }

    @media only screen and (max-width: 767px) { 
        .fungrid2 {
            display: none;
        }
    }

</style>