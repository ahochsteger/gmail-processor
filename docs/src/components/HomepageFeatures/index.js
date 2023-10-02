import clsx from 'clsx';
import React from 'react';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Automate Gmail Processing',
    Svg: require('@site/static/img/undraw_mailbox_re_dvds.svg').default,
    description: (
      <>
        Automate email processing using the provided configuration to match
        threads, messages, and attachments, and trigger actions accordingly.
      </>
    ),
  },
  {
    title: 'Google Drive Integration',
    Svg: require('@site/static/img/undraw_my_files_swob.svg').default,
    description: (
      <>
        Store files such as attachments, PDFs of messages, or entire threads into
        any location within Google Drive, providing easy organization and accessibility.
      </>
    ),
  },
  {
    title: 'Google Spreadsheet Logging',
    Svg: require('@site/static/img/undraw_spreadsheet_re_cn18.svg').default,
    description: (
      <>
        Keep track of processed threads, messages, and attachments by logging valuable
        information into a Google Spreadsheet.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
