import { Component, signal } from '@angular/core';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-greeting-cards',
  standalone: true,
  imports: [ScrollRevealDirective],
  templateUrl: './greeting-cards.component.html',
  styleUrl: './greeting-cards.component.scss',
})
export class GreetingCardsComponent {
  readonly cards = signal([
    { id: '1', name: 'Botanical Romance', occasion: 'Wedding', finish: 'Letterpress finish on cotton paper', price: 12.50, imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4jWmb3eie7Gu6khSKS7Hn37MG_pm_Y-TJCklB1xhuXSrIOXDSt33TbXDXfYd91BljvAqXjlTo4kwcY5Y0jYdMvkwS-CRJ0M1j10tZK-OiB3dbIKO_6hsz6g3R2iN9KpL3VxBguNjOks0xVW8Tqa2H6-_06CKr6yS9Y__1rlcBAu-At7qc1DxZ0-fl2Qqj-N2ZDvIgrslowiDUpRXFGm86CX2TZlVrfHIeEGmVe3MaHDuO3VKBoIxJCM7BzvcfkLBBT4QmX0_2BvyM', isFavorite: false },
    { id: '2', name: 'Golden Gratitude', occasion: 'Corporate', finish: 'Gold foil stamp on matte black', price: 15.00, imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHQvIfwfEQ3KpIb83NL01MiwPny3GMHdFumxq8g-bxM7kBqp7kus2iM5OSPtmAwPfyy7T8b6AFeTMqPu_pmYY-8KZW68gSlD6smP_p5s4YsTl882VlqqUfVnudv8Tk0fOM1ksxmA5AOqL8zMJ3IYJ24W20VU36P14i-LS9gLhvh5qt8HQ2veAcW2EvNgP4W7OTlZPqdglLSg9-dBJnu5UhNSVB0edIl8_A3a_CWWDNcEs_gTubb7t1gdJzdRVdJuY3c5CaX4_T4Wvu', isFavorite: false },
    { id: '3', name: 'Modern Celebration', occasion: 'Birthday', finish: 'Vibrant colors with spot UV coating', price: 9.00, imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBT7HTG6U0NShXZs9uVz0WA_PgBXf3qPujjL_ujqu56JOJluEruvmMfUp3rFPBhXXQY368e79FFm8mBlJgS5PENScGsCFYe43G4KqzZeFM2-SGYqz0ivDpVWKgVFC9T1fhDqwKqdrJE7Bn1dDMPD55Ean0oDifgCIGCX0lXyRSIyt658TGxAZzy8_BQ7_JnBY4DkhIj8abDcqix5nBGxsqUlG8w_7MvxkoCucnxOLbsbjzlkGE27IAZFP0TrOYoUrZ4uWfhlanyX5-E', isFavorite: false },
  ]);
}
