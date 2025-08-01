
export interface WarehouseViewModel {
  id: string;
  name: string;
  code: string;
  data: string;
  warehouseType: number;
  governorateId: string;
  governorateName: string;
  cityId: string;
  cityName: string;
  street: string;
  landmark: string;
  latitude: string;
  longitude: string;
  buildingData: string;
  isActive: boolean;
  selected: boolean;
  numberOfProduts: number;
  totalQuantity: number;
  totalProductsWeight:number;
}

export class warehouseCreateViewModel {
  id: string;
  name: string;
  code: string;
  data: string;
  warehouseType: number;
  governorateId: string;
  cityId: string;
  street: string;
  landmark: string;
  latitude: string;
  longitude: string;
  buildingData: string;

}

export class warehouseSearchViewModel {
  Name?: string;
  Code?: string;
  Data?: string;
  WarehouseType?: number;
  GovernorateId?: string;
  GovernorateName?: string;
  CityId?: string;
  CityName?: string;
  Street?: string;
  Landmark?: string;
}
export class warehouseActivateViewModel {
  id: string;
}

export class warehouseDetailsViewModel {
  id: string;
  name: string;
  code: string;
  data: string;
  warehouseType: number;
  governorateId: string;
  governorateName: string;
  cityId: string;
  cityName: string;
  street: string;
  landmark: string;
  latitude: string;
  longitude: string;
  buildingData: string;
  warehouseProducts: WarehouseProductViewModel[];
warehouseNames:[]
}

export class WarehouseProductViewModel {
  productId: string;
  productName: string;
  quantity: number;
  wigthPerKG:number;
  totalWigthPerKG:number;
}

export class productDetailsVM {
  quantity: number;
  productId: string;
}
export class WarehouseProductCreateViewModel {
  warehouseId: string;
  productWarehouses: productDetailsVM[];
}

