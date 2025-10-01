import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { ensureConfig } from '@edx/frontend-platform';
import { AppContext } from '@edx/frontend-platform/react';

import messages from './Footer.messages';
import LanguageSelector from './LanguageSelector';

ensureConfig([
  'LMS_BASE_URL',
  'LOGO_TRADEMARK_URL',
  'INDIGO_FOOTER_NAV_LINKS',
], 'Footer component');

const EVENT_NAMES = {
  FOOTER_LINK: 'edx.bi.footer.link',
};

const SiteFooter = ({
  supportedLanguages,
  onLanguageSelected,
  logo,
}) => {
  const intl = useIntl();
  const { config } = useContext(AppContext);
  const indigoFooterNavLinks = config.INDIGO_FOOTER_NAV_LINKS || [];

  const showLanguageSelector = supportedLanguages.length > 0 && onLanguageSelected;

  const externalLinkClickHandler = (event) => {
    const label = event.currentTarget.getAttribute('href');
    const eventName = EVENT_NAMES.FOOTER_LINK;
    const properties = {
      category: 'outbound_link',
      label,
    };
    sendTrackEvent(eventName, properties);
  };

  return (
    <footer
      role="contentinfo"
      className="footer wrapper-footer"
    >
      <div className="footer-container">
        <nav className="nav-colophon">
          <ol>
            {indigoFooterNavLinks.map((link) => (
              <li key={link.url}>
                <a
                  href={`${link.url.includes('http') ? '' : config.LMS_BASE_URL}${link.url}`}
                  target={link.url.includes('http') ? '_blank' : undefined}
                  rel={link.url.includes('http') ? 'noopener noreferrer' : undefined}
                >
                  {link.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <a
          className="d-block"
          href={config.LMS_BASE_URL}
          aria-label={intl.formatMessage(messages['footer.logo.ariaLabel'])}
          onClick={externalLinkClickHandler}
        >
          <img
            style={{ maxWidth: 163 }}
            src={logo || config.LOGO_TRADEMARK_URL}
            alt={intl.formatMessage(messages['footer.logo.altText'])}
          />
        </a>
        {showLanguageSelector && (
          <LanguageSelector
            options={supportedLanguages}
            onSubmit={onLanguageSelected}
          />
        )}
      </div>
    </footer>
  );
};

SiteFooter.propTypes = {
  logo: PropTypes.string,
  onLanguageSelected: PropTypes.func,
  supportedLanguages: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })),
};

SiteFooter.defaultProps = {
  logo: undefined,
  onLanguageSelected: undefined,
  supportedLanguages: [],
};

export default SiteFooter;
export { EVENT_NAMES };
