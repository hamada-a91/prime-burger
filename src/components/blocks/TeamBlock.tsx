// src/components/blocks/TeamBlock.tsx
import type { TeamBlock as TeamBlockType } from '../../config/website.config.schema';

export function TeamBlock(props: TeamBlockType) {
    const { title, subtitle, members } = props;

    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">{title}</h2>
                    {subtitle && (
                        <p className="text-xl text-muted-foreground">{subtitle}</p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {members.map((member, index) => (
                        <div key={index} className="flex flex-col items-center text-center group">
                            <div className="relative mb-6 rounded-full overflow-hidden w-40 h-40 border-4 border-muted group-hover:border-primary/20 transition-colors">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                                />
                            </div>
                            <h3 className="font-bold text-xl">{member.name}</h3>
                            <p className="text-primary font-medium mb-3">{member.role}</p>
                            {member.bio && (
                                <p className="text-muted-foreground text-sm mb-4 max-w-xs">
                                    {member.bio}
                                </p>
                            )}
                            {member.social && (
                                <div className="flex gap-3">
                                    {member.social.map((social, i) => {
                                        // You would implement a proper icon map here

                                        return (
                                            <a
                                                key={i}
                                                href={social.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-muted-foreground hover:text-primary transition-colors"
                                            >
                                                <div className="h-5 w-5 bg-current rounded-full" />
                                                {/* Placeholder dot since dynamic icon mapping needs a map */}
                                            </a>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
