import { Resume } from '@/components/dashboard-client';

export const mockResumes: Resume[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    updatedAt: '2024-05-15T10:30:00Z',
    content: {
      personal: {
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        phone: '123-456-7890',
        location: 'San Francisco, CA',
        website: 'janedoe.dev',
      },
      summary:
        'Experienced Senior Frontend Developer with over 8 years of experience in building modern, responsive, and scalable web applications. Proficient in React, TypeScript, and Next.js. Passionate about user experience and clean code.',
      experience: [
        {
          title: 'Senior Frontend Developer',
          company: 'TechCorp Inc.',
          location: 'San Francisco, CA',
          dates: 'Jan 2020 - Present',
          description:
            '- Led the development of a new design system, improving consistency and reducing development time by 30%.\n- Mentored junior developers and conducted code reviews to maintain high code quality.\n- Collaborated with UX/UI designers and product managers to translate requirements into technical solutions.',
        },
        {
          title: 'Frontend Developer',
          company: 'WebSolutions LLC',
          location: 'Austin, TX',
          dates: 'Jun 2016 - Dec 2019',
          description:
            '- Developed and maintained client-facing web applications using React and Redux.\n- Improved application performance by 20% through code optimization and lazy loading techniques.',
        },
      ],
      education: [
        {
          degree: 'B.S. in Computer Science',
          school: 'University of Texas at Austin',
          location: 'Austin, TX',
          dates: '2012 - 2016',
        },
      ],
      skills: ['React', 'TypeScript', 'Next.js', 'JavaScript', 'HTML5', 'CSS3', 'Node.js', 'GraphQL', 'Jest', 'CI/CD'],
    },
  },
  {
    id: '2',
    title: 'Product Manager',
    updatedAt: '2024-05-12T14:00:00Z',
    content: {
       personal: {
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '098-765-4321',
        location: 'New York, NY',
        website: 'johnsmith.io',
      },
      summary: 'A dynamic and results-oriented Product Manager with a 5-year track record of successfully launching and managing SaaS products. Expert in Agile methodologies, user-centric design, and data-driven decision-making. Skilled in bridging the gap between technical and business teams.',
      experience: [
        {
          title: 'Product Manager',
          company: 'Innovate Co.',
          location: 'New York, NY',
          dates: 'Mar 2019 - Present',
          description: '- Drove the product roadmap for a suite of B2B analytics tools, resulting in a 40% year-over-year growth.\n- Conducted market research and user interviews to identify customer needs and product opportunities.\n- Managed the entire product lifecycle from conception to launch and iteration.'
        },
        {
          title: 'Associate Product Manager',
          company: 'StartupX',
          location: 'Boston, MA',
          dates: 'Jul 2017 - Feb 2019',
          description: '- Assisted in the development of a new mobile application, contributing to feature prioritization and backlog grooming.\n- Analyzed product metrics to inform feature enhancements.'
        }
      ],
      education: [
        {
          degree: 'MBA',
          school: 'Harvard Business School',
          location: 'Boston, MA',
          dates: '2015 - 2017'
        },
        {
          degree: 'B.A. in Economics',
          school: 'Columbia University',
          location: 'New York, NY',
          dates: '2011 - 2015'
        }
      ],
      skills: ['Product Strategy', 'Agile/Scrum', 'Roadmap Planning', 'User Research', 'Data Analysis', 'JIRA', 'Market Analysis']
    },
  },
];