/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import IconExternalLink from '@theme/IconExternalLink';
import isInternalUrl from '@docusaurus/isInternalUrl';
const dropdownLinkActiveClass = 'dropdown__link--active';
export function NavLink({
  activeBasePath,
  activeBaseRegex,
  to,
  href,
  label,
  activeClassName = 'navbar__link--active',
  prependBaseUrlToHref,
  ...props
}) {
  // TODO all this seems hacky
  // {to: 'version'} should probably be forbidden, in favor of {to: '/version'}
  const toUrl = useBaseUrl(to);
  const activeBaseUrl = useBaseUrl(activeBasePath);
  const normalizedHref = useBaseUrl(href, {
    forcePrependBaseUrl: true,
  });
  const isExternalLink = label && href && !isInternalUrl(href);
  const isDropdownLink = activeClassName === dropdownLinkActiveClass;
  return (
    <Link
      {...(href
        ? {
            href: prependBaseUrlToHref ? normalizedHref : href,
          }
        : {
            isNavLink: true,
            activeClassName,
            to: toUrl,
            ...(activeBasePath || activeBaseRegex
              ? {
                  isActive: (_match, location) =>
                    activeBaseRegex
                      ? new RegExp(activeBaseRegex).test(location.pathname)
                      : location.pathname.startsWith(activeBaseUrl),
                }
              : null),
          })}
      {...props}>
      {isExternalLink ? (
        <span>
          {label}
          <IconExternalLink
            {...(isDropdownLink && {
              width: 12,
              height: 12,
            })}
          />
        </span>
      ) : (
        label
      )}
    </Link>
  );
}

function DefaultNavbarItemDesktop({
  className,
  isDropdownItem = false,
  ...props
}) {
  const element = (
    <NavLink
      className={clsx(
        isDropdownItem ? 'dropdown__link' : 'navbar__item navbar__link',
        className,
      )}
      {...props}
    />
  );

  if (isDropdownItem) {
    return <li>{element}</li>;
  }

  return element;
}

function DefaultNavbarItemMobile({
  className,
  isDropdownItem: _isDropdownItem,
  ...props
}) {
  return (
    <li className="menu__list-item">
      <NavLink className={clsx('menu__link', className)} {...props} />
    </li>
  );
}

function DefaultNavbarItem({
  mobile = false,
  position: _position,
  // Need to destructure position from props so that it doesn't get passed on.
  ...props
}) {

    /**
     * Added to enable non-clickable category headers.
     * To use simply add an navBar items in the config
     * with to:'category-header'
     */
    if(props.to === 'category-header')
    {
        const categorySeparatorStyles = {
            fontSize: '10px',
            color:'var(--ifm-color-emphasis-600)',
            paddingTop:'10px'

        }
        return <li style={categorySeparatorStyles}>{props.label}</li>
    }
    else
    {
        const Comp = mobile ? DefaultNavbarItemMobile : DefaultNavbarItemDesktop;
        return <Comp {...props} />;

    }
}

export default DefaultNavbarItem;
