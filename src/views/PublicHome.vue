<template>
  <div class="home">    
    <div>
            <div class="row justify-content-center">
                <div class="col-md-8 col-lg-6">
                    <MarbleAnimation />
                </div>
            </div>
            <div class="row justify-content-center my-5 px-5 py-5 newsletter-row">
                <div class="col-12 col-lg-5 mb-4 ">  
                    <h2 class="display-4"><strong>Small Archives</strong></h2> 

                    <p class="lead my-4">A simple platform for publishing collections on the web.</p>
                    <a class="btn btn-primary" href="/demo">View Demo</a>

                </div>
                <div class="col-12 col-lg-5  float-right  newsletter"> 
                    
                    <div class="card bg-transparent">
                        <div class="card-body p-0" >
                            <p>Sign up to find out when we launch, which will eventually happen, we swear.</p>
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
            <div class="row my-5 py-5 px-sm-5 justify-content-center cards-row">
                <div class="col-12 col-xl-10">
                    <div class="card-deck">
                      <div class="card">
                        <!-- <p class="text-center mt-4"><font-awesome-icon class="text-center" icon="university" size="3x" /></p> -->
                        <div class="card-body">
                            <img class="service-illo" src="img/folder-illustration.jpg"  />    
                            <h3 class="card-title">A-a-a-S</h3>
                            <p class="card-text">Small Archives is Archives-as-a-Service. No need to set anything up or host anything. Just sign up and get started.</p>
                        </div>
                      </div>
                      <div class="card">
                        <!-- <p class="text-center mt-4"><font-awesome-icon class="text-center" icon="file-image" size="3x" /></p> -->
                        <div class="card-body">
                          <img class="service-illo" src="img/media-illustration.jpg" />  
                          <h3 class="card-title">Multi-media</h3>
                          <p class="card-text">Add images, audio, PDFs, and youtube videos, with many more media types to come! Visitors can view all media in-browser, no downloading required!</p>
                        </div>
                      </div>
                      <div class="card">
                        <!-- <p class="text-center mt-4"><font-awesome-icon class="text-center" icon="archive" size="3x" /></p> -->
                        <div class="card-body">
                            <img class="service-illo" src="img/metadata-illustration.jpg" />  
                          <h3 class="card-title">Metadata</h3>
                          <p class="card-text">Small Archives uses default Dublin Core Metatdata fields, with a few minor modifications. Input forms have handy tips for those less familiar with what all the terms mean.</p>
                        </div>
                      </div>
                    </div>                    
                </div>             
            </div>              
            <div class="row px-sm-5 justify-content-center example-row">
                <div class="col-12 col-lg-4">
                    <h2 class="h2">Check it out</h2>
                    <p>View an example of a small archive with our demo collection.</p>
                    <p><a href="/demo" class="btn btn-primary">See Example</a></p>                    
                </div>                 
                <div class="col-12 col-lg-6 p-0">
                    <a href="/demo">
                        <img class="img-link" src="img/demo-screenshot.png" />     
                    </a>                    
                </div>   
            </div>               

            <hr class="my-4" />
            <div class="row my-5 px-sm-5 justify-content-center">
                <div class="col-12 col-xl-10">
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

import MarbleAnimation from '../components/MarbleAnimation'



export default {
  name: 'PublicHome',
  components: {
    MarbleAnimation 
  },
}
</script>

<style scoped lang="scss">

    $blue: #ff0000;
    $pink: #c29ca7;

    .card {
        border: 0px;
        background-color: transparent;
    }

    .newsletter-row {
        border-bottom: 1px solid $pink;
    }

    .example-row {
        border-top: 1px solid $pink;
        color: #000000;
        padding-top: 6em;
        padding-bottom: 6em;
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

</style>