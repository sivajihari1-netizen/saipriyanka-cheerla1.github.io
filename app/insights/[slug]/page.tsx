import type { Metadata }  from 'next';
import { notFound }       from 'next/navigation';
import Link               from 'next/link';
import { PortableText }   from '@portabletext/react';
import { client }         from '@/sanity/client';
import { ARTICLE_BY_SLUG_QUERY } from '@/sanity/queries';
import type { Article }  from '@/lib/types';
import { formatDateFull } from '@/lib/utils';
import Nav                from '@/components/Nav';
import Footer             from '@/components/Footer';
import ScrollReveal       from '@/components/ScrollReveal';

export const revalidate = 60;

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await client
    .fetch<Article | null>(ARTICLE_BY_SLUG_QUERY, { slug: params.slug })
    .catch(() => null);
  if (!article) return { title: 'Insight Not Found' };
  const title       = article.seo?.metaTitle ?? article.title;
  const description = article.seo?.metaDescription ?? article.excerpt ?? '';
  return { title, description, openGraph: { title, description } };
}

export default async function InsightDetailPage({ params }: Props) {
  const article = await client
    .fetch<Article | null>(ARTICLE_BY_SLUG_QUERY, { slug: params.slug })
    .catch(() => null);
  if (!article) notFound();

  return (
    <>
      <Nav settings={null} />
      <main style={{ paddingTop: '6rem', background: 'var(--paper)' }}>
        <div style={{ background: 'var(--ink)', padding: '5rem 0 4rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(184,148,63,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(184,148,63,.04) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
          <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '900px' }}>
            <Link href="/insights" style={{ fontSize: '.68rem', fontWeight: 500, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(184,148,63,.7)', textDecoration: 'none', display: 'inline-block', marginBottom: '1.5rem' }}>
              ← Insights
            </Link>
            <div style={{ marginBottom: '.75rem', color: 'rgba(255,255,255,.7)', fontSize: '.75rem', fontWeight: 500, letterSpacing: '.08em', textTransform: 'uppercase' }}>
              {article.category}
            </div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 400, lineHeight: 1.1, color: '#fff', marginBottom: '.75rem' }}>
              {article.title}
            </h1>
            <div style={{ color: 'rgba(255,255,255,.5)', fontSize: '.86rem' }}>
              Published {formatDateFull(article.publishDate)} • {article.readingTime} min read
            </div>
          </div>
        </div>

        <div className="container" style={{ maxWidth: '900px', padding: '3.5rem 3.5rem 6rem' }}>
          {article.excerpt && <blockquote style={{ borderLeft: '2px solid var(--gold)', paddingLeft: '1.5rem', margin: '0 0 2rem', fontFamily: 'var(--serif)', fontSize: '1.1rem', fontStyle: 'italic', lineHeight: 1.75, color: 'var(--ink-soft)' }}>{article.excerpt}</blockquote>}

          {article.body && article.body.length > 0 ? (
            <PortableText value={article.body} />
          ) : (
            <p style={{ color: 'var(--muted)', margin: '1rem 0 3rem' }}>This article is being prepared. Please check back shortly.</p>
          )}

          {article.tags && article.tags.length > 0 && (
            <div style={{ marginTop: '2rem', display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}>
              {article.tags.map((tag: string) => (
                <span key={tag} style={{ background: 'var(--surface)', border: '1px solid var(--rule)', borderRadius: '999px', padding: '.3rem .7rem', fontSize: '.73rem', color: 'var(--muted)' }}>#{tag}</span>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer settings={null} />
      <ScrollReveal />
    </>
  );
}
