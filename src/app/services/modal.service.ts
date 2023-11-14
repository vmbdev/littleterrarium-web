import {
  Injectable,
  TemplateRef,
  createComponent,
  EnvironmentInjector,
  ApplicationRef
} from '@angular/core';
import { Subject } from 'rxjs';

import {
  ConfirmModalComponent
} from '@components/modals/confirm-modal/confirm-modal.component';
import {
  QuickModalComponent
} from '@components/modals/quick-modal/quick-modal.component';

type ModalType = 'quick' | 'confirm';
type ModalOptions = {
  title: string
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  modalSubs?: Subject<string>;

  constructor(
    private injector: EnvironmentInjector,
    private app: ApplicationRef
  ) { }

  open(content: TemplateRef<any>, type: ModalType, options?: ModalOptions) {
    const contentViewRef = content.createEmbeddedView(null);
    const componentOptions = {
      environmentInjector: this.injector,
      projectableNodes: [contentViewRef.rootNodes]
    };
    // Template inside root, needed to keep everything working with the themes
    const mainElement = this.app.components[0].instance.mainElement;
    let component;

    if (type === 'quick') {
      component = createComponent<QuickModalComponent>(
        QuickModalComponent,
        componentOptions
      );

      component.instance.title = options?.title ? options.title : '';
      component.instance.close.subscribe(() => this.close());
    }
    else {
      component = createComponent<ConfirmModalComponent>(
        ConfirmModalComponent,
        componentOptions
      );

      component.instance.accept.subscribe(() => this.accept());
      component.instance.cancel.subscribe(() => this.close());
    }

    mainElement.nativeElement.appendChild(component.location.nativeElement);
    
    this.app.attachView(component.hostView);
    component.hostView.detectChanges();
    component.changeDetectorRef.detectChanges();

    this.modalSubs = new Subject<string>();

    return this.modalSubs.asObservable();
  }

  accept() {
    this.modalSubs?.next('accept');
    this.modalSubs?.complete();
  }

  close() {
    this.modalSubs?.complete();
  }
}
