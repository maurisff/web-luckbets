<template>
  <div id="notfound">
		<div class="notfound">
			<div class="notfound-404"></div>
			<h1>Oops!!!</h1>
			<h2>Algo não esta certo por aqui!</h2>
      <br/>
			<p v-if="message"><span>Mensagem: </span><br/>{{message}}</p>
      <p v-else/>
      <v-btn outlined block dark color="primary" right @click.stop="goHome">Home Page</v-btn>
		</div>
	</div>
</template>
<script>

export default {
  name: 'OtherErro',
  data() {
    return {
    }
  },
  methods: {    
    async goHome (){
      this.$router.push({ path: '/' }).catch(() => { });
    }
  },
  computed: {
    message() {
      return this.$store.getters['app/getErro']
    }
  },
  created () {
    if (!this.message )
      this.$router.push({ path: '/' }).catch(() => { });
  }
}
</script>
<style scoped>
* {
  -webkit-box-sizing: border-box;
          box-sizing: border-box;
}

body {
  padding: 0;
  margin: 0;
}

#notfound {
  position: relative;
  height: 100vh;
}

#notfound .notfound {
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
      -ms-transform: translate(-50%, -50%);
          transform: translate(-50%, -50%);
}

.notfound {
  max-width: 560px;
  width: 100%;
  padding-left: 160px;
  line-height: 1.1;
}

.notfound .notfound-404 {
  position: absolute;
  left: 0;
  top: 0;
  display: inline-block;
  width: 140px;
  height: 140px;
  background-image: url('../../assets/404_images/404_emoji.png');
  background-size: cover;
}

.notfound .notfound-404:before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-transform: scale(2.4);
      -ms-transform: scale(2.4);
          transform: scale(2.4);
  border-radius: 50%;
  background-color: #f2f5f8;
  z-index: -1;
}

.notfound h1 {
  font-family: 'Nunito', sans-serif;
  font-size: 65px;
  font-weight: 700;
  margin-top: 0px;
  margin-bottom: 10px;
  color: #151723;
  text-transform: uppercase;
}

.notfound h2 {
  font-family: 'Nunito', sans-serif;
  font-size: 21px;
  font-weight: 400;
  margin: 0;
  text-transform: uppercase;
  color: #151723;
}

.notfound p {
  font-family: 'Nunito', sans-serif;
  color: #999fa5;  
  font-size: 18px;
  font-weight: 700;
}
.notfound p span {
  font-family: 'Nunito', sans-serif;
  color: #5a5a53;  
  font-size: 18px;
  font-weight: 900;
}

@media only screen and (max-width: 767px) {
  .notfound .notfound-404 {
    width: 110px;
    height: 110px;
  }
  .notfound {
    padding-left: 15px;
    padding-right: 15px;
    padding-top: 110px;
  }
}
</style>
