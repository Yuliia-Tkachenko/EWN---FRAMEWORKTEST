# Page snapshot

```yaml
- main [ref=e2]:
  - img "EWN Logo" [ref=e3]
  - generic [ref=e5]:
    - group [ref=e7]:
      - generic [ref=e8] [cursor=pointer]: Username
      - generic [ref=e9]:
        - textbox "Username" [ref=e10]
        - generic [ref=e11]: Username is required.
    - group [ref=e13]:
      - generic [ref=e14] [cursor=pointer]: Password
      - generic [ref=e15]:
        - textbox "Password" [ref=e16]
        - link "Forget?" [ref=e17] [cursor=pointer]:
          - /url: /static/forgot-password
        - generic [ref=e18]: Password is required.
    - generic [ref=e19]:
      - button "Log In" [disabled] [ref=e20]
      - link "Contact Us" [ref=e22] [cursor=pointer]:
        - /url: /static/contact-us
    - generic [ref=e23]:
      - paragraph [ref=e24]: © 2026 All rights reserved.
      - paragraph [ref=e25]: Access is restricted to authorized users who have been issued valid login credentials by Energy Worldnet. If you are not an authorized user, exit now to avoid possible civil or criminal liability.
```