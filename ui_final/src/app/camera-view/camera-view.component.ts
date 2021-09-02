import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';
import { WebcamMirrorProperties } from 'ngx-webcam'

@Component({
    selector: 'app-camera-view',
    templateUrl: './camera-view.component.html',
    styleUrls: ['./camera-view.component.css']
})

export class CameraViewComponent implements OnInit {
    
    public webcamImage: WebcamImage = null;
    // webcam snapshot trigger
    private trigger: Subject<void> = new Subject<void>();
    public webcamMirrorProperties = new WebcamMirrorProperties();
    @Output() imageEmitter: EventEmitter<string> = new EventEmitter<string>();
    @Output() closeCameraViewEmitter: EventEmitter<void> = new EventEmitter<void>();
    
    ngOnInit(): void {
        this.webcamMirrorProperties.x = "never"
    }


    triggerSnapshot(): void {
        this.trigger.next();
    }

    handleImage(webcamImage: WebcamImage): void {
        this.webcamImage = webcamImage;
        this.imageEmitter.emit(this.webcamImage.imageAsDataUrl);
    }

    resetImage() {
        this.webcamImage = null;
        this.imageEmitter.emit(null);
    }

    closeCameraView() {
        this.webcamImage = null;
        this.closeCameraViewEmitter.emit();
    }
   
    public get triggerObservable(): Observable<void> {
        return this.trigger.asObservable();
    }
}