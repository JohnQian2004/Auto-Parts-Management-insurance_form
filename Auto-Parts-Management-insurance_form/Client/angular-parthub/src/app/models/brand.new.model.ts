
class BrandNew {
  brand : string = "";
  models : Model[]  = new Array(); 
}

class Model {
  name : string = "";
  submodels : Submodel[]  = new Array(); 
}

class Submodel {
  name : string = "";
  engines : string[]  = new Array(); 
}

export { BrandNew, Model, Submodel };