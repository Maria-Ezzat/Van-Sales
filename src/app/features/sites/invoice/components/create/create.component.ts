import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/shared/service/shared.service';
import { InvoiceService } from '../../service/invoice.service';
import { CrudIndexBaseUtils } from 'src/app/shared/classes/crud-index.utils';
import { CRUDCreatePage } from 'src/app/shared/classes/crud-create.model';
import { environment } from 'src/environments/environment';
import { InvoiceCreateViewModel } from '../../interface/invoice-view-model';
import { ControlType } from 'src/app/shared/models/enum/control-type.enum';
import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  page: CRUDCreatePage = new CRUDCreatePage();
  item: InvoiceCreateViewModel = new InvoiceCreateViewModel();
  id: string;
  environment = environment;
  controlType = ControlType;
  constructor(public _sharedService: SharedService,
    private _pageService: InvoiceService, private _router: Router, private activatedRoute: ActivatedRoute, private translate: TranslateService

  ) {
  }
  Clients: any[] = [];
  Products: any[] = [];
  selectedProducts: any[] = [];
  selectedProductId: string
  quantityErrors: string[] = [];
  total: number = 0;
  taxAmount: number = 0;
  netInvoice: number = 0;
  netWeight: number = 0;

  allProducts = [

  ];
  ngOnInit(): void {
    this.page.isPageLoaded = false;
    this.activatedRoute.paramMap.subscribe((params) => {
      if (params.has('id')) {
        this.id = params.get('id');
        this.page.isEdit = true;
      }
    });


    this.createForm();
    this.page.form.get('productID')?.valueChanges.subscribe(productId => {
      this.onProductSelect(productId);
    });

    this.loadClients();
    this.page.form.get('clientID')?.valueChanges.subscribe(() => {
      this.onClientChange();
    });
  }
  onProductSelect(productId: string | null) {
    if (!productId) return;
    const selected = this.allProducts.find(p => p.id === productId);
    if (selected && !this.selectedProducts.find(p => p.id === selected.id)) {
      this.selectedProducts.push({
        ...selected,
        quantity: 1,
        isEditing: false
      });
      this.calculateTotal();
    }

    // Reset selection
    this.selectedProductId = null;
    this.page.form.get('productID')?.setValue(null);
  }

  deleteProduct(index: number) {
    this.selectedProducts.splice(index, 1);
    this.calculateTotal();
  }



  createForm() {
    this.page.form = this._sharedService.formBuilder.group({
      clientID: [this.item.clientID, [Validators.required]],
      salesManID: [this.item.salesManID],
      notes: [this.item.notes],
      invoiceDetails: [this.item.invoiceDetails, Validators.required],
      productID: [null]
    });
    this.page.isPageLoaded = true;
  }


  Save() {
    this.page.isSaving = true;

    // استخراج SalesManID من التوكن
    const salesManID = this.getSalesmanIdFromToken();

    // استخراج القيم من الفورم
    const formValues = this.page.form.value;

    // تحويل selectedProducts إلى invoiceDetails[]
    const invoiceDetails = this.selectedProducts.map(p => ({
      productId: p.id,
      itemWeightPerKG: p.weight,
      quantity: p.quantity,
      itemPrice: p.price
    }));

    // بناء الـ InvoiceCreateViewModel للإرسال
    const payload: InvoiceCreateViewModel = {
      id: this.item.id,
      clientID: formValues.clientID,
      salesManID: salesManID,
      notes: formValues.notes,
      invoiceDetails: invoiceDetails
    };

    // إرسال الريكوست
    this._pageService.postOrUpdate(payload).subscribe({
      next: (res) => {
        this.page.isSaving = false;
        this.page.responseViewModel = res;
        this._sharedService.showToastr(res);
        if (res.isSuccess) {
          this._router.navigate(['/sites/invoice']);
        }
      },
      error: () => {
        this.page.isSaving = false;
      },
    });
  }

  loadClients() {
    this._pageService.getClients().subscribe((res: any) => {
      if (res && res.isSuccess) {
        this.Clients = res.data || [];
      }
    });
  }

  loadProducts() {
    const clientID = this.page.form.get('clientID')?.value;
    const salesManID = this.getSalesmanIdFromToken();
    if (!clientID || !salesManID) return;

    const requestPayload = {
      SalesManID: salesManID,
      ClientID: clientID,
      StorageType: 2
    };

    this._pageService.getProducts(requestPayload).subscribe((res: any) => {
      if (res && res.isSuccess) {
        this.Products = res.data || [];
        this.allProducts = this.Products.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.itemPrice,
          weight: p.itemWeightPerKG,
          maxQuantity: p.maxQuantity
        }));
      }
    });
  }



  onClientChange() {
    this.loadProducts();
  }

  getSalesmanIdFromToken(): string | null {
    const token = localStorage.getItem('eToken');
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload?.ID || null;
  }


  toggleEdit(index: number) {
    const item = this.selectedProducts[index];

    this.quantityErrors[index] = '';
    if (item.isEditing === true) {
      if (item.quantity > item.maxQuantity) {
        this.quantityErrors[index] = `Maximum allowed is ${item.maxQuantity}`;
        return;
      }
    }

    item.isEditing = !item.isEditing;

    if (!item.isEditing) {
      this.calculateTotal();
    }
  }



  calculateTotal() {
    this.total = this.selectedProducts.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
    this.taxAmount = (this.total * 0.14);
    this.netInvoice = this.total + this.taxAmount;
    this.netWeight = this.selectedProducts.reduce((sum, item) => {
      return sum + (item.weight * item.quantity);
    }, 0);
  }

  onCancel() {
    this._router.navigate(['/sites/invoice']);
  }

  onQuantityChange(index: number) {
  const item = this.selectedProducts[index];

  if (item.quantity < 1 || !item.quantity) {
    item.quantity = 1;
  }

  if (item.quantity > item.maxQuantity) {
    item.quantity = item.maxQuantity;
    this.quantityErrors[index] = this.translate.instant('sites.Invoice.maxQuantityError', {
      max: item.maxQuantity
    });
  } else {
    this.quantityErrors[index] = '';
  }

  this.calculateTotal();
}




}
