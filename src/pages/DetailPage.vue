<template>
  <q-page>
    <div class="row q-pa-md justify-center">
      <div class="col-12 col-sm-10 col-md-8 col-xl-7">
        <div class="row q-pa-md items-center">
          <div class="col-12 col-md-2">
            <q-btn icon="arrow_back" rounded color="primary" label=" back" @click="Router.back()"/>
          </div>
          <div class="col-10">
            <span class="q-py-xs text-bold">film name</span>
          </div>
        </div>
        <div class="row justify-center q-pa-md">
          <div class="col-12" >
            <div class="row bg-amber custom-rounded-borders overflow-hidden" v-if="movieDetail">
              <div class="col-12 col-sm-6">
                <q-img
                  class="fit custom-rounded-right-borders"
                  :src="imageBaseUrl+movieDetail.backdrop_path"
                  style="max-height: 70vh"
                />
              </div>
              <div class="col-12 col-sm-6 column justify-center q-py-xl q-px-md">
                <div class="row justify-between q-py-lg">
                   <span class="text-capitalize q-pl-md">Budget:</span>
                   <span class="text-capitalize q-pl-md">{{movieDetail.budget}}</span>
                </div>
                <div class="row justify-between q-py-lg">
                  <span class="text-capitalize q-pl-md">Revenue</span>
                  <span class="text-capitalize q-pl-md">{{ movieDetail.revenue }}</span>
                </div>
                <div class="row justify-between q-py-lg">
                  <span class="text-capitalize q-pl-md">Release date</span>
                  <span class="text-capitalize q-pl-md">{{ movieDetail.release_date }}</span>
                </div>
                <div class="row justify-between q-py-lg">
                  <span class="text-capitalize q-pl-md">Runtime</span>
                  <span class="text-capitalize q-pl-md">{{movieDetail.runtime}}</span>
                </div>
                <div class="row justify-between q-py-lg">
                  <span class="text-capitalize q-pl-md">Vote_average</span>
                  <span class="text-capitalize q-pl-md">{{ movieDetail.vote_average }}</span>
                </div>
                <div class="row justify-between">
                  <span class="text-capitalize q-pl-md">Genres</span>
<!--                  <span class="text-capitalize q-pl-md">{{movieDetail.genres}}</span>-->
                  <span class="inline-block">
                  <span v-for="(firibz,index) in movieDetail?.genres" :key="firibz.id">{{firibz.name}}<span v-if="index !==movieDetail.genres.length-1">, </span></span>
                  </span>
                </div>
              </div>

            </div>
          </div>
<!--          <div class="col-6 "><div class="text-strike q-pl-md">$=60R/////////////////////sold</div>-->
<!--            <div class="text-capitalize q-pl-md">sample-imdb////////////////////////////nice</div>-->
<!--            <div class="text-bold q-pl-md">no information///////////////////////////////////hi</div>-->
<!--            <div class="text-capitalize q-pl-md">date:2023/26/02/////////////////////////////data</div>-->
<!--          </div>-->
        </div>
        <div class="row justify-center">
          <div class="col-12 q-pa-md" >
         {{movieDetail?.overview}}
          </div>
        </div>
        <div class="row justify-center" v-if="movieCredits">
          <div class="col-12 q-px-md q-pt-xl" >
            <span v-for="(cast,index) in sortCastByPopularity.slice(0, 10)" :key="cast.id">{{cast.name}}
              <span v-if="sortCastByPopularity.length <10 ? index !== sortCastByPopularity.length-1 : index !==10-1">, </span></span>
            <span v-if="sortCastByPopularity.length >10"> & {{sortCastByPopularity.length-10}} more. </span>.
          </div>
        </div>
      </div>
    </div>
<!--    <img-->
<!--      alt="Quasar logo"-->
<!--      src="~assets/quasar-logo-vertical.svg"-->
<!--      style="width: 200px; height: 200px"-->
<!--    >-->
  </q-page>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import {useRoute, useRouter} from "vue-router";
import {movieService} from "src/services/movie.service";

export default defineComponent({
  name: 'DetailPage',
  setup () {
    const Route = useRoute();
    const Router = useRouter();
    const current = ref(1)
    const text = ref("")
    const text2 = ref("")
    const movieId = Route.query.movieId;
    const movieDetail = ref(null);
    const movieCredits = ref(null);
    const imageBaseUrl = process.env.IMAGE_BASE_URL;

    const sortCastByPopularity = computed(() => {
      const khar= movieCredits.value['cast'].concat().sort(function(a, b){return b.popularity - a.popularity});
      console.log('khar')
      console.log(khar)
      return khar;
    })
    // function sortCastByPopularity() {
    //
    //    const khar = movieCredits.value['cast'].concat().sort(function(a, b){return b.popularity - a.popularity});
    //    console.log('khar')
    //    console.log(khar)
    //   return khar;
    // }

    movieService.getMovieDetail(movieId).then((result)=>{
      movieDetail.value = result.data;
      console.log('result')
      console.log(movieDetail.value)
    }).catch((error)=>{
      console.log('ridi')
      console.log(error)
    })
    console.log('Route')
    console.log(Route.query.movieId)
    movieService.getCredits(movieId).then((result)=>{
      movieCredits.value = result.data;
      console.log('result')
      console.log(movieCredits.value.cast)
    }).catch((error)=>{
      console.log('ridi')
      console.log(error)
    })

    return {
      current,
      text,
      text2,
      movieDetail,
      imageBaseUrl,
      movieCredits,
      sortCastByPopularity,
      Router,
      // essentialLinks: linksList,
      // leftDrawerOpen,
      // toggleLeftDrawer () {
      //   leftDrawerOpen.value = !leftDrawerOpen.value
      // }
    }
  }
})
</script>
