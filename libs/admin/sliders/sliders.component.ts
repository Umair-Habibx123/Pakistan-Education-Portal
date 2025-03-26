import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-sliders',
  templateUrl: './sliders.component.html',
  styleUrls: ['./sliders.component.scss']
})
export class SlidersComponent {

  isModalOpen = false;
  previewImageUrl: string | ArrayBuffer | null = null;

  slides = [
    { logo: '../../../assets/slider.png' },
    { logo: '../../../assets/slider.png' },
    { logo: '../../../assets/slider.png' },
    { logo: '../../../assets/slider.png' },
  ];

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  triggerFileUpload() {
    this.fileInput.nativeElement.click(); // Open file dialog
  }


  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Validate file type
      const validTypes = ['image/svg+xml', 'image/png', 'image/jpeg'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (SVG, PNG, JPG)');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewImageUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);

      // You can emit the file or handle it as needed
      console.log('Selected file:', file);
    }
  }
  resetForm()
  {
    this.previewImageUrl = null;

  }
}
