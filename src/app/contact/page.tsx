import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const developers = [
    { name: 'Lasya\nSadubugga', linkedIn: 'https://www.linkedin.com/in/lasya-sadubugga-875381326/', imageUrl: 'https://tse2.mm.bing.net/th/id/OIP.ZIo3DjlwXs3Y1MV_6Q6ipQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3' },
    { name: 'Nandhini\nEravelli', linkedIn: 'https://www.linkedin.com/in/nandhini-eravelli-10aa74326/', imageUrl: 'https://tse2.mm.bing.net/th/id/OIP.TQVTfCnrta25DfegOdBrYAHaHa?w=900&h=900&rs=1&pid=ImgDetMain&o=7&rm=3' },
    { name: 'Yalgam\nVarshini', linkedIn: 'https://www.linkedin.com/in/yalagam-varshini-3bb012327/', imageUrl: 'https://img.freepik.com/premium-photo/anime-girl-with-long-black-hair-blue-eyes-red-dress-generative-ai_1034982-32795.jpg?w=360' },
    { name: 'Kavya\nJunjunuri', linkedIn: 'https://www.linkedin.com/in/kavya-junjunuri-665852317/', imageUrl: 'https://yt3.googleusercontent.com/ks-fcZ08SUN1l3NB84ctf859r99I2lvBXN7H4M2vChnDziKpSg57HRiL1TYrj8o9zl9Lyre3xQ=s900-c-k-c0x00ffffff-no-rj' },
];

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 sm:py-16 md:py-24">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full mb-4 w-fit">
                <Image src="https://cdn.vectorstock.com/i/500p/04/97/modern-ai-letter-logo-concept-vector-28470497.jpg" alt="Team Astra Logo" width={48} height={48} className="rounded-full" />
            </div>
            <CardTitle className="text-3xl font-bold">Meet Team Astra</CardTitle>
            <CardDescription>
              Connect with the developers behind ResumeAI.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8">
             {developers.map((dev) => (
                <div key={dev.name} className="flex flex-col items-center text-center gap-3">
                    <Link
                        href={dev.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex flex-col items-center gap-3"
                    >
                        <div className="relative h-28 w-28">
                          <Image
                            src={dev.imageUrl}
                            alt={`Profile picture of ${dev.name.replace('\n', ' ')}`}
                            width={112}
                            height={112}
                            className="rounded-full object-cover border-4 border-transparent group-hover:border-primary/50 transition-all duration-300 group-hover:scale-105"
                           />
                        </div>
                        <p className="font-semibold text-card-foreground whitespace-pre-line leading-tight">{dev.name}</p>
                    </Link>
                </div>
             ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
