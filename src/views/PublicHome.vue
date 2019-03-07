<template>
  <div class="home">    
    <div>
  
            <div class="row justify-content-center my-5 px-sm-5 py-5 newsletter-row">
                <div class="col-12 col-lg-7 col-xl-5 pr-5 mb-4">  
                    <h2 class="display-3"><strong>Small Archives</strong></h2>  
                    <p class="lead my-4">Create simple online collections. Add media, add metadata, and share.</p>                
                </div>
                <div class="col-12 col-lg-5 col-xl-4 float-right  newsletter"> 
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
                            <hr class="my-4" />
                            <font-awesome-icon class="float-left pr-2" :icon="['fab', 'twitter']" size="2x" />
                            <p>Or follow our progress on twitter <a href="https://twitter.com/smallarchives">@smallarchives</a>.</p>
                        </div>
                    </div>          
                </div>
            </div>   
            <div class="row px-sm-5 justify-content-center example-row">
                <div class="col-12 col-lg-4 col-xl-3">
                    <h2 class="h2">Check it out</h2>
                    <p>View an example of a small archive with our demo collection.</p>
                    <p><a href="/demo" class="btn btn-light">See Example</a></p>                    
                </div>                 
                <div class="col-12 col-lg-8 col-xl-5 p-0">
                    <a href="/demo">
                        <img class="img-link" src="img/demo-screenshot.png" />     
                    </a>                    
                </div>   
            </div>               
            <div class="row my-5 px-sm-5 justify-content-center cards-row">
                <div class="col-12 col-xl-10">
                    <div class="card-deck">
                      <div class="card">
                        <!-- <p class="text-center mt-4"><font-awesome-icon class="text-center" icon="university" size="3x" /></p> -->
                        <div class="card-body">
                            <h3 class="card-title">A-a-a-S.</h3>
                            <p class="card-text">Small Archives is Archives-as-a-Service. No need to set anything up or host anything. Just sign up and get started.</p>
                        </div>
                      </div>
                      <div class="card">
                        <!-- <p class="text-center mt-4"><font-awesome-icon class="text-center" icon="file-image" size="3x" /></p> -->
                        <div class="card-body">

                          <h3 class="card-title">Multi-media.</h3>
                          <p class="card-text">Add images, audio, PDFs, and youtube videos, with many more media types to come! Visitors can view all media in-browser, no downloading required!</p>
                        </div>
                      </div>
                      <div class="card">
                        <!-- <p class="text-center mt-4"><font-awesome-icon class="text-center" icon="archive" size="3x" /></p> -->
                        <div class="card-body">
                          <h3 class="card-title">Metadata.</h3>
                          <p class="card-text">Small Archives uses default Dublin Core Metatdata fields, with a few minor modifications. Input forms have handy tips for those less familiar with what all the terms mean.</p>
                        </div>
                      </div>
                    </div>                    
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
<!-- 
            <hr class="my-4"/>
            <div class="row my-5">
                <div class="col-sm-6">
                    <h2 class="h4">A-a-a-S</h2>
                    <p >Small Archives is Archives-as-a-Service, no need to set anything up or host anything. Just start building collections.</p>                     
                </div>
                <div class="col-sm-6">
                    <h2 class="h4">No Archive Too Small</h2>
                    <p>We made an archive with just one thing in it.</p>
                    <a href="https://smallarchives.com/u/alex/rWUPShMrsrvbUgnJmqnz">Check it out</a>.
                </div>        
            </div>   -->
        
<!--             <div class="row my-5">
                <div class="col-sm-6">
                      
                </div>
                <div class="col-sm-6">
                    <h2 class="h4">Get In Touch</h2>
                        <p>Questions, comments, concerns?</p>
                         <ul class="list-unstyled">
                            <li><strong>Email:</strong> smallarchives at gmail dot com</li>
                            <li><strong>Twitter:</strong> @smallarchives</li>
                            <li><strong>Instagram:</strong> @smallarchives</li>
                        </ul> 
                </div>        
            </div>  -->           

	</div>


  </div>
</template>

<style scoped lang="scss">

    $blue: #0011cf;
    $pink: #fff4e6;

    .card {
        border: 0px;
        background-color: transparent;
    }


    .example-row {
        background-color: $blue;
        color: $pink;
        padding-top: 6em;
        padding-bottom: 6em;
    }

    .lead {
        font-size: 1.6em;
        line-height: 1.4em;
    }

    .btn-dark {
        background-color: $blue;
        color: $pink;
        border: 1px solid $blue;
        font-family: 'inter';
        &:hover {
            color: $blue;
            background-color: $pink;
        }
    }

    .btn-light {
        background-color: $pink;
        color: $blue;
        border: 1px solid $pink;
        font-family: 'inter';
        &:hover {
            color: $pink;
            background-color: $blue;
        }        
    }    



</style>