<template>
  <div class="about my-3 pb-5">
    <div class="row justify-content-md-center">
    	<div class="col-lg-8">  	
    		<h1 class="my-3">SMALL ARCHIVES.</h1>
    		
    		<p class="my-4 lead">Small Archives is an online platform for creating simple digital collections.</p>
            <div class="card my-5">
              <div class="card-body">
                <h5 class="card-title">Stay apprised</h5>
                <p class="card-text">Get periodic updates on how Small Archives is progressing and if/when it ever launches:</p>
                <form class="form-inline" action="https://tinyletter.com/smallarchives" method="post" target="popupwindow" onsubmit="window.open('https://tinyletter.com/smallarchives', 'popupwindow', 'scrollbars=yes,width=800,height=600');return true">
                    <div class="form-group mb-2">
                        <label for="tlemail" class="sr-only">Email address</label>
                        <input type="text" name="email" id="tlemail" placeholder="Email address" class="form-control mr-sm-2" />
                        <input type="hidden" value="1" name="embed"/><input type="submit" value="Subscribe" class="btn-primary btn" />
                    </div>
                </form>
              </div>
            </div>        


    	</div>
	</div>
  </div>
</template>