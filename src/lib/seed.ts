import { connectDB } from './mongodb';
import { User, Event, Announcement, Family, Participant, Result, Registration } from '@/models';
import { hashPassword } from './auth';

export async function seedDatabase() {
  await connectDB();

  // 1. Seed Admin User
  const adminEmail = 'admin@colonygames.com';
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const hashedPassword = await hashPassword('Admin@Colony2026!');
    await User.create({
      name: 'Fest Chief Coordinator',
      email: adminEmail,
      password: hashedPassword,
      phone: '+91 98765 43210',
      role: 'admin',
    });
    console.log('Seeded Admin: admin@colonygames.com / Admin@Colony2026!');
  }

  // 2. Seed Default Sports Events
  const eventsCount = await Event.countDocuments();
  if (eventsCount === 0) {
    const sportsData = [
      {
        title: 'Box Cricket League (T10)',
        slug: 'cricket-t10',
        sportType: 'Cricket',
        category: 'Team',
        description: 'Thrilling 10-over tennis ball cricket tournament with 8 players a side. Knockout rounds leading to the floodlit grand finale.',
        rules: [
          '8 players a side + 2 impact substitutes.',
          '10 overs per innings. Maximum 2 overs per bowler.',
          'Standard society box cricket boundary rules apply.',
          'Direct hit outside boundary net without bounce is Out (Net rule).',
        ],
        minAge: 14,
        maxAge: 65,
        teamSize: 8,
        maxParticipants: 64,
        registeredCount: 32,
        venue: 'Main Society Sports Oval',
        scheduleDate: '2026-10-15',
        scheduleTime: '08:00 AM - 01:00 PM',
        status: 'open',
        iconName: 'Shield',
        bannerImage: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Society Football Super Cup (5v5)',
        slug: 'football-5v5',
        sportType: 'Football',
        category: 'Team',
        description: 'Fast-paced, high-octane 5-a-side football on turf under floodlights. Pure skill, strategy, and teamwork.',
        rules: [
          '5 players on field including 1 goalkeeper + 3 rolling substitutes.',
          '15 minutes per half with 5 minutes halftime break.',
          'No offside rule. Direct kick from kickoff not allowed.',
          'Slide tackling is prohibited for athlete safety.',
        ],
        minAge: 12,
        maxAge: 55,
        teamSize: 5,
        maxParticipants: 40,
        registeredCount: 25,
        venue: 'Society Turf Arena',
        scheduleDate: '2026-10-15',
        scheduleTime: '04:00 PM - 08:30 PM',
        status: 'open',
        iconName: 'Flame',
        bannerImage: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Field Hockey Penalty Shootout',
        slug: 'hockey-shootout',
        sportType: 'Hockey',
        category: 'Individual',
        description: 'Test your agility, stick work, and nerve in an exciting 8-second 1v1 penalty shootout contest against top society goalkeepers.',
        rules: [
          'Attacker starts from 23m line with 8 seconds to score.',
          'Goalkeeper must stay on goal line until attacker touches the ball.',
          'Best of 5 rounds in knockouts, sudden death in playoffs.',
          'Standard shin guards and mouthguards recommended.',
        ],
        minAge: 10,
        maxAge: 50,
        teamSize: 1,
        maxParticipants: 32,
        registeredCount: 18,
        venue: 'All-Weather Astro Court',
        scheduleDate: '2026-10-16',
        scheduleTime: '09:00 AM - 12:00 PM',
        status: 'open',
        iconName: 'Zap',
        bannerImage: 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Table Tennis Open (Singles & Doubles)',
        slug: 'table-tennis-championship',
        sportType: 'Table Tennis',
        category: 'Individual',
        description: 'Indoor rapid spin championship with Junior, Senior, and Veteran brackets. Premium Stag tables with official 3-star balls.',
        rules: [
          'Best of 3 games of 11 points each; Finals best of 5 games.',
          'Service toss must be at least 16 cm high with open palm.',
          'Non-marking footwear strictly mandatory in indoor hall.',
        ],
        minAge: 8,
        maxAge: 75,
        teamSize: 1,
        maxParticipants: 48,
        registeredCount: 28,
        venue: 'Clubhouse Indoor Arena - Hall 2',
        scheduleDate: '2026-10-16',
        scheduleTime: '02:00 PM - 07:00 PM',
        status: 'open',
        iconName: 'Target',
        bannerImage: 'https://images.unsplash.com/photo-1534158914592-062992fbe900?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: '100m Society Sprint & Relay',
        slug: '100m-race',
        sportType: 'Race',
        category: 'Individual',
        description: 'The premier athletics spectacle to crown the fastest resident of the society across Kids, Open, and Masters categories.',
        rules: [
          'Official electronic timing gates and photo-finish sensors.',
          'False start rule: 1 warning per heat, second false start disqualified.',
          'Spikes or athletic running trainers permitted.',
        ],
        minAge: 6,
        maxAge: 70,
        teamSize: 1,
        maxParticipants: 60,
        registeredCount: 42,
        venue: 'Central Boulevard Track',
        scheduleDate: '2026-10-17',
        scheduleTime: '07:30 AM - 10:30 AM',
        status: 'closing-soon',
        iconName: 'Timer',
        bannerImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Slow Cycling Balance Challenge',
        slug: 'slow-cycling-challenge',
        sportType: 'Slow Cycling',
        category: 'Individual',
        description: 'The ultimate test of bicycle equilibrium! Who can ride the slowest across a 25-meter marked lane without touching the ground or stopping?',
        rules: [
          '25-meter lane width of 1 meter. Rider who takes the LONGEST time wins.',
          'Touching feet to the ground or crossing boundary lane results in disqualification.',
          'Bicycle must stay in continuous forward motion (no track-stand stoppage).',
          'Standard society bicycles provided or bring your own.',
        ],
        minAge: 8,
        maxAge: 65,
        teamSize: 1,
        maxParticipants: 36,
        registeredCount: 19,
        venue: 'Clubhouse Promenade',
        scheduleDate: '2026-10-17',
        scheduleTime: '11:00 AM - 01:00 PM',
        status: 'open',
        iconName: 'Compass',
        bannerImage: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Badminton Smash Championship',
        slug: 'badminton-championship',
        sportType: 'Badminton',
        category: 'Individual',
        description: 'High-speed shuttlecock action on wooden badminton courts. Men singles, Women singles, and Mixed Family Doubles.',
        rules: [
          'BWF 21-point rally scoring system. Best of 3 sets.',
          'Yonex Mavis 350 nylon shuttles provided.',
          'Non-marking badminton shoes strictly required.',
        ],
        minAge: 9,
        maxAge: 70,
        teamSize: 1,
        maxParticipants: 50,
        registeredCount: 38,
        venue: 'Main Badminton Courts A & B',
        scheduleDate: '2026-10-17',
        scheduleTime: '03:00 PM - 08:30 PM',
        status: 'open',
        iconName: 'Award',
        bannerImage: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: '3x3 Half-Court Basketball Shootout',
        slug: 'basketball-3x3',
        sportType: 'Basketball',
        category: 'Team',
        description: 'Urban 3-on-3 basketball on the outdoor acrylic court. Fast 12-second shot clock with continuous offensive play.',
        rules: [
          '3 players + 1 substitute. 10-minute game or first to 21 points.',
          '1 point for inside arc, 2 points from beyond arc.',
          'Ball must be cleared behind arc on every change of possession.',
        ],
        minAge: 13,
        maxAge: 50,
        teamSize: 3,
        maxParticipants: 36,
        registeredCount: 24,
        venue: 'Outdoor Basketball Complex',
        scheduleDate: '2026-10-18',
        scheduleTime: '08:30 AM - 12:30 PM',
        status: 'open',
        iconName: 'Activity',
        bannerImage: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Inter-Block Tug of War Championship',
        slug: 'tug-of-war-championship',
        sportType: 'Custom',
        category: 'Family',
        description: 'The mega crowd-puller finale event! Tower vs Tower battle of pure grit, harmony, and raw strength.',
        rules: [
          '8 members per team (must include at least 2 women and 1 teenager).',
          'Total team weight checked on scale before draw.',
          'Best 2 out of 3 pulls of 2.5 meters rope displacement.',
        ],
        minAge: 14,
        maxAge: 65,
        teamSize: 8,
        maxParticipants: 48,
        registeredCount: 32,
        venue: 'Grand Central Lawn',
        scheduleDate: '2026-10-18',
        scheduleTime: '04:30 PM - 07:00 PM',
        status: 'open',
        iconName: 'Users',
        bannerImage: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80',
      },
    ];

    await Event.insertMany(sportsData);
    console.log('Seeded 9 Sports Events');
  }

  // 3. Seed Announcements
  const announcementsCount = await Announcement.countDocuments();
  if (announcementsCount === 0) {
    const announcements = [
      {
        title: 'ColonyGames 2026 Registration Open for All Towers!',
        content: 'Registration is now officially open for all 50+ society families. Pick your favourite sports, register family members, and receive your digital QR pass instantly!',
        priority: 'high',
        category: 'general',
        isPinned: true,
        publishedAt: new Date(),
      },
      {
        title: 'Badminton & Table Tennis Court Practice Slots Available',
        content: 'Registered players can book practice sessions every evening between 6:00 PM and 8:00 PM starting this Monday at the Clubhouse.',
        priority: 'normal',
        category: 'schedule',
        isPinned: false,
        publishedAt: new Date(Date.now() - 86400000),
      },
      {
        title: 'T-Shirt Fitting & Athlete Kit Distribution Counter',
        content: 'Official ColonyGames 2026 dry-fit sports t-shirts will be distributed at Tower-C Club Lounge on Oct 13-14 from 10 AM to 8 PM.',
        priority: 'normal',
        category: 'rules',
        isPinned: false,
        publishedAt: new Date(Date.now() - 172800000),
      },
    ];
    await Announcement.insertMany(announcements);
    console.log('Seeded Announcements');
  }

  // 4. Seed Sample Families and Results if leaderboard is empty
  const familiesCount = await Family.countDocuments();
  if (familiesCount === 0) {
    const families = [
      {
        familyName: 'Sharma Residence',
        houseNumber: '402',
        blockTower: 'Tower A',
        primaryContactName: 'Rajesh Sharma',
        primaryPhone: '+91 98234 11223',
        primaryEmail: 'rajesh.sharma@example.com',
        points: 48,
        medals: { gold: 3, silver: 1, bronze: 2 },
      },
      {
        familyName: 'Verma Villa',
        houseNumber: 'Villa-14',
        blockTower: 'Villa Block',
        primaryContactName: 'Sunil Verma',
        primaryPhone: '+91 98111 22334',
        primaryEmail: 'sunil.verma@example.com',
        points: 42,
        medals: { gold: 2, silver: 3, bronze: 1 },
      },
      {
        familyName: 'Deshmukh Family',
        houseNumber: '701',
        blockTower: 'Tower B',
        primaryContactName: 'Ananya Deshmukh',
        primaryPhone: '+91 97333 44556',
        primaryEmail: 'ananya.deshmukh@example.com',
        points: 35,
        medals: { gold: 2, silver: 1, bronze: 2 },
      },
      {
        familyName: 'Mehta Haven',
        houseNumber: '304',
        blockTower: 'Tower C',
        primaryContactName: 'Kunal Mehta',
        primaryPhone: '+91 99222 33445',
        primaryEmail: 'kunal.mehta@example.com',
        points: 29,
        medals: { gold: 1, silver: 2, bronze: 3 },
      },
      {
        familyName: 'Kulkarni Quarters',
        houseNumber: '1102',
        blockTower: 'Tower D',
        primaryContactName: 'Vikram Kulkarni',
        primaryPhone: '+91 98444 55667',
        primaryEmail: 'vikram.kulkarni@example.com',
        points: 24,
        medals: { gold: 1, silver: 1, bronze: 2 },
      },
    ];

    const insertedFamilies = await Family.insertMany(families);
    console.log('Seeded 5 Sample Families for Leaderboard');

    // Seed sample results
    const resultsCount = await Result.countDocuments();
    if (resultsCount === 0) {
      const raceEvent = await Event.findOne({ sportType: 'Race' });
      const ttEvent = await Event.findOne({ sportType: 'Table Tennis' });

      if (raceEvent) {
        await Result.create({
          eventId: raceEvent._id,
          eventTitle: raceEvent.title,
          category: 'Men 100m Sprint',
          sportType: 'Race',
          publishedAt: new Date(),
          winners: [
            {
              rank: 1,
              medal: 'Gold',
              participantName: 'Aarav Sharma',
              familyId: insertedFamilies[0]._id,
              familyName: insertedFamilies[0].familyName,
              houseNumber: insertedFamilies[0].houseNumber,
              blockTower: insertedFamilies[0].blockTower,
              scoreOrTime: '11.82s',
              pointsAwarded: 10,
              notes: 'New society sprint record!',
            },
            {
              rank: 2,
              medal: 'Silver',
              participantName: 'Rohan Verma',
              familyId: insertedFamilies[1]._id,
              familyName: insertedFamilies[1].familyName,
              houseNumber: insertedFamilies[1].houseNumber,
              blockTower: insertedFamilies[1].blockTower,
              scoreOrTime: '12.15s',
              pointsAwarded: 7,
            },
            {
              rank: 3,
              medal: 'Bronze',
              participantName: 'Aditya Deshmukh',
              familyId: insertedFamilies[2]._id,
              familyName: insertedFamilies[2].familyName,
              houseNumber: insertedFamilies[2].houseNumber,
              blockTower: insertedFamilies[2].blockTower,
              scoreOrTime: '12.44s',
              pointsAwarded: 5,
            },
          ],
        });
      }

      if (ttEvent) {
        await Result.create({
          eventId: ttEvent._id,
          eventTitle: ttEvent.title,
          category: 'Open Singles',
          sportType: 'Table Tennis',
          publishedAt: new Date(),
          winners: [
            {
              rank: 1,
              medal: 'Gold',
              participantName: 'Priya Verma',
              familyId: insertedFamilies[1]._id,
              familyName: insertedFamilies[1].familyName,
              houseNumber: insertedFamilies[1].houseNumber,
              blockTower: insertedFamilies[1].blockTower,
              scoreOrTime: '3 - 1 (11-9, 8-11, 11-6, 11-7)',
              pointsAwarded: 10,
            },
            {
              rank: 2,
              medal: 'Silver',
              participantName: 'Kabir Mehta',
              familyId: insertedFamilies[3]._id,
              familyName: insertedFamilies[3].familyName,
              houseNumber: insertedFamilies[3].houseNumber,
              blockTower: insertedFamilies[3].blockTower,
              scoreOrTime: '1 - 3 (9-11, 11-8, 6-11, 7-11)',
              pointsAwarded: 7,
            },
            {
              rank: 3,
              medal: 'Bronze',
              participantName: 'Sanjay Kulkarni',
              familyId: insertedFamilies[4]._id,
              familyName: insertedFamilies[4].familyName,
              houseNumber: insertedFamilies[4].houseNumber,
              blockTower: insertedFamilies[4].blockTower,
              scoreOrTime: '3 - 0 (11-7, 11-5, 11-8)',
              pointsAwarded: 5,
            },
          ],
        });
      }
      console.log('Seeded Initial Results');
    }
  }

  return { success: true, message: 'Database seeded successfully!' };
}
