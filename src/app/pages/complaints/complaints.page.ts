/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-complaints',
  templateUrl: './complaints.page.html',
  styleUrls: ['./complaints.page.scss'],
})
export class ComplaintsPage implements OnInit {
  order_id: any = '';
  issue_with: any = '';
  driver_id: any = '';
  store_id: any = '';
  reason_id: any = '';
  product_id: any = '';
  title: any = '';
  short_message: any = '';
  status: any = '';
  loaded: boolean;
  stores: any[] = [];
  drivers: any[] = [];
  products: any[] = [];
  images: any[] = [];
  reasons: any[] = [
    'The product arrived too late',
    'The product did not match the description',
    'The purchase was fraudulent',
    'The product was damaged or defective',
    'The merchant shipped the wrong item',
    'Wrong Item Size or Wrong Product Shipped',
    'Driver arrived too late',
    'Driver behavior',
    'Store Vendors behavior',
    'Issue with Payment Amout',
    'Others',
  ];
  submitted: boolean = false;
  constructor(
    public util: UtilService,
    public api: ApiService,
    private route: ActivatedRoute,
    private actionSheetController: ActionSheetController
  ) {
    this.route.queryParams.subscribe((data: any) => {
      console.log(data);
      if (data && data.id) {
        this.order_id = data.id;
        this.loaded = false;
        this.getOrder();
      }
    })
  }
  getOrder() {
    this.api.post_private('v1/orders/getByOrderId', { id: this.order_id }).then((data: any) => {
      console.log(data);
      this.loaded = true;
      if (data && data.status && data.status == 200 && data.data) {
        this.stores = data.storeInfo;
        this.drivers = data.driverInfo;
        const info = data.data;
        if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(info.orders)) {
          this.products = JSON.parse(info.orders);
          console.log('order', this.products);
        }
        console.log(info);
      } else {
        this.util.errorToast(this.util.translate('Something went wrong'));
      }
    }, error => {
      console.log(error);
      this.loaded = true;
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log(error);
      this.loaded = true;
      this.util.apiErrorHandler(error);
    });
  }
  ngOnInit() {
  }

  getStoreName(id: any) {
    const item = this.stores.filter(x => x.uid == id);
    if (item && item.length) {
      return ' - ' + item[0].name;
    }
    return '';
  }

  onProduct() {
    console.log(this.product_id);
    const item = this.products.filter(x => x.id == this.product_id);
    if (item && item.length) {
      this.store_id = item[0].store_id;
    }
  }

  callApi() {
    console.log('call API');
    const param = {
      uid: localStorage.getItem('uid'),
      order_id: this.order_id,
      issue_with: this.issue_with,
      driver_id: this.driver_id,
      store_id: this.store_id,
      product_id: this.product_id,
      reason_id: this.reason_id,
      title: this.title,
      short_message: this.short_message,
      status: 0,
      images: JSON.stringify(this.images)
    }
    console.log(param);
    this.util.show();
    this.api.post_private('v1/complaints/registerNewComplaints', param).then((data: any) => {
      console.log(data);
      this.util.hide();
      if (data && data.status && data.status == 200) {
        this.util.showToast('Your Complaint is register', 'success', 'bottom');
        this.util.onBack();
      }
    }, error => {
      console.log(error);
      this.util.hide();
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log(error);
      this.util.hide();
      this.util.apiErrorHandler(error);
    });
  }

  onSave() {
    console.log(this.issue_with);
    console.log(this.reason_id, this.reason_id != '', this.reason_id != null);
    console.log(this.title);
    console.log(this.short_message);
    console.log(this.store_id);
    console.log(this.driver_id);
    console.log(this.product_id);
    this.submitted = true;
    if (this.issue_with != '' && this.issue_with != null && this.reason_id != '' && this.reason_id != null && this.title != '' && this.title != null &&
      this.short_message != '' && this.short_message != null) {
      console.log('ok');
      if (this.issue_with == 1 && this.store_id != '' && this.store_id != null) {
        console.log('order');
        this.callApi();
        return false;
      }
      if (this.issue_with == 2 && this.store_id != '' && this.store_id != null) {
        this.callApi();
        console.log('store');
        return false;
      }

      if (this.issue_with == 3 && this.driver_id != '' && this.driver_id != null) {
        this.callApi();
        console.log('driver');
        return false;
      }

      if (this.issue_with == 4 && this.product_id != '' && this.product_id != null) {
        this.callApi();
        console.log('product');
        return false;
      }
    } else {
      console.log('global');
      this.util.errorToast('All fields are required');
      return false;
    }

  }

  async uploadImage() {
    const actionSheet = await this.actionSheetController.create({
      header: this.util.translate('Choose from'),
      buttons: [{
        text: this.util.translate('Camera'),
        icon: 'camera',
        handler: () => {
          console.log('camera clicked');
          this.upload(CameraSource.Camera);
        }
      }, {
        text: this.util.translate('Gallery'),
        icon: 'images',
        handler: () => {
          console.log('gallery clicked');
          this.upload(CameraSource.Photos);
        }
      }, {
        text: this.util.translate('Cancel'),
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });

    await actionSheet.present();
  }

  async upload(source: CameraSource) {
    console.log('open', source);
    try {
      const image = await Camera.getPhoto({
        source,
        quality: 50,
        resultType: CameraResultType.Base64
      });
      console.log('image output', image);
      if (image && image.base64String) {
        const blobData = this.b64toBlob(image.base64String, `image/${image.format}`);
        this.util.show(this.util.translate('Uploading..'));
        this.api.uploadImage('v1/uploadImage', blobData, image.format).then((data) => {
          console.log('image upload', data);
          this.util.hide();
          if (data && data.status == 200 && data.success == true && data.data.image_name) {
            this.images.push(data.data.image_name);
            console.log('this cover', this.images);

          } else {
            console.log('NO image selected');
          }
        }, error => {
          console.log(error);
          this.util.hide();
          this.util.apiErrorHandler(error);
        }).catch(error => {
          console.log('error', error);
          this.util.hide();
          this.util.apiErrorHandler(error);
        });
      }
    } catch (error) {
      console.log(error);
      this.util.apiErrorHandler(error);
    }
  }

  b64toBlob(b64Data: any, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
}
