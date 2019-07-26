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
        <div class="row justify-content-center px-md-5 py-md-5 my-md-5 d-flex">
            <div class="col-12 col-lg-8 my-md-5 order-2 order-lg-1 ">  
                <!-- <h2 class="h1 display-5"><strong>Small Archives</strong></h2>  -->
                <h2 class="my-4 pb-2 display-4 intro-text">Small Archives is a simple web platform for publishing collections of <span class="random-item">{{randomItem}}.</span></h2>
                <p class="pt-5">
                <a class="btn btn-primary" href="/sign-up">Beta Sign Up</a>
                <a class="btn btn-outline-primary ml-3" href="/demo">View Demo</a>
                </p>
                

            </div>

        </div> 
        <div class="row mt-5 pt-md-5 px-md-5 justify-content-center cards-row no-border">
            <div class="col-12 col-12 col-lg-8 my-md-3">
                <h2>Features –</h2>
                <p class="lead">Some of the stuff that Small Archives offers.</p>
                <div class="row noborder pb-md-5">
                    <div class="col-12 col-lg-4 my-3">
                        <h3 class="card-title text-left">Multi-media –</h3>
                        <p class="card-text text-left">Mix and match images, audio, video and PDFs to display your collection as you see fit.</p>
                    </div>
                    <div class="col-12 col-lg-4 my-3">
                        <h3 class="card-title text-left">Metadata –</h3>
                        <p class="card-text text-left">Small Archives uses default Dublin Core Metatdata fields, with a few minor modifications, and clear field definitions to assist with data entry.</p>
                    </div>
                    <div class="col-12 col-lg-4 my-3">
                        <h3 class="card-title text-left">A-a-a-S –</h3>
                        <p class="card-text text-left">Small Archives is Archives-as-a-Service. No need to set anything up or host anything. Just sign up and get started.</p>                            
                    </div>  
                </div>
                <div class="row noborder my-md-5">
                    <div class="col-12 col-lg-4 my-3">
                        <h3 class="card-title text-left">Tags –</h3>
                        <p class="card-text text-left">Define custom filterable tags to group items together.</p>
                    </div>
                    <div class="col-12 col-lg-4 my-3">
                        <h3 class="card-title text-left">Lookin' good –</h3>
                        <p class="card-text text-left">Display your collections in beautiful grid and list views with custom thumbnails. Add a map view if your data contains geographic information.</p>
                    </div>
                    <div class="col-12 col-lg-4 my-3">
                        <h3 class="card-title text-left">Export – </h3>
                        <p class="card-text text-left">Take your data with you with full CSV exports.</p>
                    </div>  
                </div>                    
            </div>                              
        </div>
        <div class="row mt-5 pt-md-5 px-md-5 justify-content-center cards-row no-border">
            <div class="col-12 col-12 col-lg-8 my-md-3">
                <h2>Not Features –</h2>
                <p class="lead">Some of the stuff that Small Archives does not offer.</p>
                <div class="row noborder pb-md-5">
                    <div class="col-12 col-lg-4 my-3">
                        <h3 class="card-title text-left">Social Networking –</h3>
                        <p class="card-text text-left">There is no way to friend anybody, like anything, or subscribe to anything.</p>
                    </div>
                    <div class="col-12 col-lg-4 my-3">
                        <h3 class="card-title text-left">Machine Learning –</h3>
                        <p class="card-text text-left">Small Archives can't automatically detect anything...we don't know how.</p>
                    </div>
                    <div class="col-12 col-lg-4 my-3">
                        <h3 class="card-title text-left">Algorithms –</h3>
                        <p class="card-text text-left">We only know two algorithms: <code>y=mx+b</code> and <code>a2+b2=c2</code>, and we haven't figured out how to make those helpful for this product.</p>                            
                    </div>  
                </div>                   
            </div>                              
        </div>        
        <div class="row px-sm-5 mb-4 py-5 justify-content-center example-row">
            <div class="col-12 col-lg-5 p-0 text-center">
                <!-- <a href="/demo">
                    <img class="img-link" src="img/demo-screenshot.jpg" />     
                </a>  -->
                <video class="demo-video fullscreen" autoplay loop muted>
                <source src="img/smallarchives-demo.mp4" type="video/mp4">
                <!-- fallback for browsers that don't support video tag -->
                <a href="img/smallarchives-demo.mp4">download video</a>
                </video>                

            </div>
            <div class="col-12 col-lg-3 pl-0 mx-0 pl-lg-5 py-5">           
                <h2 class="h2">View a demo –</h2>
                <p>View an example of a small archive with our demo collection.</p>
                <p><a href="/demo" class="btn btn-warning">View Demo</a></p>                    
            </div>               
        </div>                               
        <div class="row justify-content-center px-md-5 py-5 ">
            <div class="col-12 col-lg-4 mb-4 pr-5">
                <h3>Ongoing Development</h3>  
                <p>Small Archives is still in active beta development. We are doing some fine-tuning before working out businessy things like pricing. You can view (and make comments on) our public roadmap <a href="https://trello.com/b/i04fENfA/small-archives-roadmap">here</a>, or view our code repository <a href="https://github.com/alexharris/smallarchives">here</a>.</p>
                <p>We greatly appreciate any feedback and want to make a tool that satisfies real people's needs.</p>
                <h4>Questions, comments, concerns? –</h4>
                    <ul class="list-unstyled my-4">
                    <li><strong>Email:</strong> smallarchives at gmail dot com</li>
                    <li><strong>Twitter:</strong> @smallarchives</li>
                    <li><strong>Instagram:</strong> @smallarchives</li>
                </ul> 

            </div>
            <div class="col-12 col-lg-4 newsletter"> 
                
                <div class="card bg-transparent">
                    <div class="card-body p-0" >
                        <h3>Newsletter –</h3> 
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
  data() {
      return {
          randomItem: 'items',
          i: 0      }
  },
  created() {
      window.setInterval(this.rotateItems, 4000);
      
  },
  methods: {
      rotateItems: function() {
        
        ++this.i;

        var randomItems = [
            'items', 
            'photographs that your mom took', 
            'old postcards',
            'types of weeds in your yard',
            'your favorite magic cards',
            'random home movies from goodwill',
            'some PDFs that were around',
            'animated gifs',
            'tsotchkes'
            ]

        this.randomItem = randomItems[this.i]

        if(this.i == randomItems.length -1) {
            this.i = 0
        }
      }
  }
}
</script>

<style scoped lang="scss">


    .card {
        border: 0px;
        background-color: transparent;
    }

    .row {
        border-bottom: 1px solid lightgrey;
        &.noborder {
            border: none;
        }
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

    .intro-text {
        display: inline-block;
        height: 7em
    }

    .random-item {
        color: red;     
    }

    .example-row {
        background-color:#021626;
        z-index: -200;
        color: white;
    }

    video.fullscreen { 
        max-width: 100%;
    // position: relative;
    // top: 50%;
    // left: 50%;
    // min-width: 100%;
    // min-height: 100%;
    // width: auto;
    // height: auto;
    // z-index: -100;
    // transform: translate(-50%, -50%);
    }    
 
    @media only screen and (max-width: 767px) { 
        .fungrid2 {
            display: none;
        }

    }

</style>