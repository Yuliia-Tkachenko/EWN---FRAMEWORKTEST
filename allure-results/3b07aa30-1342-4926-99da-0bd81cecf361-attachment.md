# Page snapshot

```yaml
- main [ref=e2]:
  - img "EWN Logo" [ref=e3]
  - generic [ref=e5]:
    - group [ref=e7]:
      - generic [ref=e8] [cursor=pointer]: Username
      - textbox "Username" [ref=e10]: Andryflitt
    - group [ref=e12]:
      - generic [ref=e13] [cursor=pointer]: Password
      - generic [ref=e14]:
        - textbox "Password" [active] [ref=e15]: Qwerty2207!!
        - link "Forget?" [ref=e16] [cursor=pointer]:
          - /url: /static/forgot-password
    - generic [ref=e17]:
      - button "Log In" [ref=e18] [cursor=pointer]
      - link "Contact Us" [ref=e20] [cursor=pointer]:
        - /url: /static/contact-us
    - generic [ref=e21]:
      - paragraph [ref=e22]: © 2026 All rights reserved.
      - paragraph [ref=e23]: Access is restricted to authorized users who have been issued valid login credentials by Energy Worldnet. If you are not an authorized user, exit now to avoid possible civil or criminal liability.
```