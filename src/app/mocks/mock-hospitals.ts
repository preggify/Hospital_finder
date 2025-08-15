import { Hospital } from '../models/hospital.model';

export const MOCK_HOSPITALS: Record<string, Hospital[]> = {
  'California': [
    {
      id: '1',
      state: 'California',
      name: 'California General Hospital',
      location: '123 Healthcare Ave, Los Angeles, CA 90001',
      services: ['General Checkup', 'Maternity', 'Emergency', 'Surgery'],
      delivery_cost: {
        normal: 5000,
        emergency: 8000,
        cs: 10000,
        currency: 'USD'
      },
      contact: '+1 (213) 555-1234',
      type: 'Public',
      admin_code: 'ADMIN123',
      comments: [
        {
          text: 'Great maternity ward with caring staff.',
          author: 'Jane Doe',
          createdAt: new Date('2025-05-15')
        },
        {
          text: 'Clean facilities and professional doctors.',
          author: 'John Smith',
          createdAt: new Date('2025-06-20')
        }
      ]
    },
    {
      id: '2',
      state: 'California',
      name: 'West Coast Medical Center',
      location: '456 Health Street, San Francisco, CA 94101',
      services: ['General Checkup', 'Pediatrics', 'Cardiology', 'Oncology'],
      delivery_cost: {
        normal: 6500,
        emergency: 9500,
        cs: 12000,
        currency: 'USD'
      },
      contact: '+1 (415) 555-5678',
      type: 'Private',
      admin_code: 'ADMIN456',
      comments: [
        {
          text: 'Excellent pediatric care for my son.',
          author: 'Sarah Johnson',
          createdAt: new Date('2025-07-05')
        }
      ]
    }
  ],
  'New York': [
    {
      id: '3',
      state: 'New York',
      name: 'Manhattan Medical Institute',
      location: '789 Healthcare Blvd, New York, NY 10001',
      services: ['General Checkup', 'Emergency', 'Neurology', 'Surgery', 'Orthopedics'],
      delivery_cost: {
        normal: 7000,
        emergency: 10000,
        cs: 15000,
        currency: 'USD'
      },
      contact: '+1 (212) 555-9012',
      type: 'Teaching',
      admin_code: 'ADMIN789',
      comments: [
        {
          text: 'Top notch neurological department.',
          author: 'Michael Brown',
          createdAt: new Date('2025-04-10')
        }
      ]
    }
  ],
  'Texas': [
    {
      id: '4',
      state: 'Texas',
      name: 'Lone Star Hospital',
      location: '321 Medical Drive, Houston, TX 77001',
      services: ['General Checkup', 'Maternity', 'Emergency', 'Cardiology', 'Dermatology'],
      delivery_cost: {
        normal: 4500,
        emergency: 7500,
        cs: 9000,
        currency: 'USD'
      },
      contact: '+1 (713) 555-3456',
      type: 'Public',
      admin_code: 'ADMIN321',
      comments: [
        {
          text: 'Reasonable prices and good service.',
          author: 'Robert Davis',
          createdAt: new Date('2025-05-22')
        },
        {
          text: 'Fantastic maternity care. Would recommend!',
          author: 'Emily Wilson',
          createdAt: new Date('2025-06-30')
        }
      ]
    },
    {
      id: '5',
      state: 'Texas',
      name: 'Austin Health Partners',
      location: '654 Care Lane, Austin, TX 78701',
      services: ['General Checkup', 'Pediatrics', 'Oncology', 'Physical Therapy'],
      delivery_cost: {
        normal: 5500,
        emergency: 8500,
        cs: 11000,
        currency: 'USD'
      },
      contact: '+1 (512) 555-7890',
      type: 'Private',
      admin_code: 'ADMIN654',
      comments: []
    }
  ],
  'Florida': [
    {
      id: '6',
      state: 'Florida',
      name: 'Miami Sunshine Hospital',
      location: '789 Palm Ave, Miami, FL 33101',
      services: ['General Checkup', 'Pediatrics', 'Emergency', 'Cardiology', 'Dermatology'],
      delivery_cost: {
        normal: 5800,
        emergency: 8700,
        cs: 10500,
        currency: 'USD'
      },
      contact: '+1 (305) 555-1111',
      type: 'Public',
      admin_code: 'ADMIN111',
      comments: [
        {
          text: 'Excellent pediatrics department.',
          author: 'Maria Rodriguez',
          createdAt: new Date('2025-07-12')
        }
      ]
    },
    {
      id: '7',
      state: 'Florida',
      name: 'Orlando Family Care',
      location: '123 Disney Way, Orlando, FL 32801',
      services: ['General Checkup', 'Maternity', 'Pediatrics', 'Orthopedics'],
      delivery_cost: {
        normal: 5200,
        emergency: 8100,
        cs: 9800,
        currency: 'USD'
      },
      contact: '+1 (407) 555-2222',
      type: 'Private',
      admin_code: 'ADMIN222',
      comments: []
    }
  ],
  'Illinois': [
    {
      id: '8',
      state: 'Illinois',
      name: 'Chicago Medical Center',
      location: '456 Windy Ave, Chicago, IL 60601',
      services: ['General Checkup', 'Emergency', 'Surgery', 'Neurology', 'Cardiology'],
      delivery_cost: {
        normal: 6200,
        emergency: 9200,
        cs: 12500,
        currency: 'USD'
      },
      contact: '+1 (312) 555-3333',
      type: 'Teaching',
      admin_code: 'ADMIN333',
      comments: [
        {
          text: 'State-of-the-art surgical facilities.',
          author: 'David Miller',
          createdAt: new Date('2025-06-05')
        }
      ]
    }
  ],
  'Georgia': [
    {
      id: '9',
      state: 'Georgia',
      name: 'Atlanta Health Partners',
      location: '789 Peachtree St, Atlanta, GA 30303',
      services: ['General Checkup', 'Maternity', 'Emergency', 'Oncology'],
      delivery_cost: {
        normal: 5500,
        emergency: 8300,
        cs: 10300,
        currency: 'USD'
      },
      contact: '+1 (404) 555-4444',
      type: 'Private',
      admin_code: 'ADMIN444',
      comments: []
    },
    {
      id: '10',
      state: 'Georgia',
      name: 'Savannah Memorial Hospital',
      location: '321 River St, Savannah, GA 31401',
      services: ['General Checkup', 'Pediatrics', 'Cardiology', 'Physical Therapy'],
      delivery_cost: {
        normal: 4900,
        emergency: 7800,
        cs: 9500,
        currency: 'USD'
      },
      contact: '+1 (912) 555-5555',
      type: 'Public',
      admin_code: 'ADMIN555',
      comments: [
        {
          text: 'Caring staff and clean facilities.',
          author: 'Emma Johnson',
          createdAt: new Date('2025-05-10')
        }
      ]
    }
  ]
};
