export default {
  namespace:"noobox",
  state:{

  },
  effects:{
    *test({payload},{put,select}){
      console.log(payload);
    }
  },
  reducers:{

  },
}