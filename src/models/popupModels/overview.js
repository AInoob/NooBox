
export default {
  namespace:"overview",
  state:{

  },
  effects:{
    *test({payload},{put,select}){
      console.log(payload);
    },
    *autoRefresh({payload},{put,select}){
      
    }
  },
  reducers:{

  },
}