import React, { useContext } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { ensureConfig } from '@edx/frontend-platform';
import { AppContext } from '@edx/frontend-platform/react';
import {
  Container,
} from '@openedx/paragon';
import PropTypes from 'prop-types';

import '../../_footer.scss';

import messages from '../Footer.messages';
import LanguageSelector from '../LanguageSelector';
import StudioFooterHelpSectionSlot from '../../plugin-slots/StudioFooterHelpSectionSlot';

ensureConfig([
  'LMS_BASE_URL',
  'MARKETING_SITE_BASE_URL',
  'TERMS_OF_SERVICE_URL',
  'PRIVACY_POLICY_URL',
  'SUPPORT_EMAIL',
  'SITE_NAME',
  'STUDIO_BASE_URL',
  'ENABLE_ACCESSIBILITY_PAGE',
  'INDIGO_FOOTER_NAV_LINKS'
], 'Studio Footer component');

const StudioFooter = ({
  containerProps,
  supportedLanguages,
  onLanguageSelected,
  logo,
}) => {
  const intl = useIntl();
  const { config } = useContext(AppContext);

  const { containerClassName, ...restContainerProps } = containerProps || {};
  const indigoFooterNavLinks = config.INDIGO_FOOTER_NAV_LINKS || [];
  const allowedLanguages = supportedLanguages || [];
  const showLanguageSelector = allowedLanguages.length > 0 && onLanguageSelected;


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
    <>
      <StudioFooterHelpSectionSlot containerProps={containerProps} />
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
              options={allowedLanguages}
              onSubmit={onLanguageSelected}
            />
          )}
        </div>
      </footer>
    </>
  );
};

StudioFooter.propTypes = {
  containerProps: PropTypes.shape(Container.propTypes),
};

StudioFooter.defaultProps = {
  containerProps: {},
};

export default StudioFooter;
