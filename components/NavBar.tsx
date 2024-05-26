"use client";

import { usePathname } from "next/navigation";
import { AuthUser, getCurrentUser } from "aws-amplify/auth";
import Logout from "./Logout";
import { useState, useEffect } from "react";
import Link from "next/link";

const getNavLinks = (pathname: string, user?: AuthUser) => {
  if (user) {
    return (
      <Link
        onClick={() => Howler.stop()}
        href="/profile" className={`navbar-item${pathname === '/profile' ? ' is-selected' : ''}`}
      >
        Profile
      </Link>
    );
  }

  return <></>
};

const getAccountButtons = (user?: AuthUser) => {
  if (user) {
    return (
      <Logout />
    );
  }

  return (
    <a className="button is-primary" href="/login">
      Log in
    </a>
  );
};

export default function NavBar(props: {user?: AuthUser}) {
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | undefined>(props.user);

  useEffect(() => {
    getCurrentUser().then(setUser).catch(reason => setUser(undefined));
  }, [pathname]);

  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <a className="navbar-item" href="/">
          <b className="is-size-4">MelodyLink</b>
        </a>

        <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbarBasicExample" className="navbar-menu">
        <div className="navbar-start">
          {getNavLinks(pathname, user)}
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              {getAccountButtons(user)}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}