-- ── LEGACY CUSTOMERS ────────────────────────────────────────────────────────
-- Seeded from Square production account (64 customers, fetched 2026-03-09)
-- Trigger grants 'legacy' membership tier on signup if email matches

-- 1. Table
CREATE TABLE IF NOT EXISTS public.legacy_customers (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email            text NOT NULL UNIQUE,
  square_customer_id text,
  name             text,
  created_at       timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.legacy_customers ENABLE ROW LEVEL SECURITY;

-- Admins can read; no public access
CREATE POLICY "admin_read_legacy_customers"
  ON public.legacy_customers FOR SELECT
  USING (auth.uid() = '4b63e9d9-1cf9-49a1-9427-89e4035f8115'::uuid);

-- 2. Seed — all 64 Square customers (emails normalised to lowercase)
INSERT INTO public.legacy_customers (id, email, square_customer_id, name, created_at) VALUES
  (gen_random_uuid(), 'nikolaka17387@gmail.com', '9HJHCZ7N4S7H5237FARBYKSHQG', 'Nicolas Loo', '2025-11-26T17:18:16.383Z'::timestamptz),
  (gen_random_uuid(), 'chrisloo@ymail.com', 'WHXQBWYN36ET11RAK9WWQDN2P0', 'Chris Loo', '2025-11-26T17:25:29.527Z'::timestamptz),
  (gen_random_uuid(), 'asccrfmly@yahoo.com', 'PD8YM5H5JSTA8YMAHZEX37MVCC', 'Andrea Eggleston', '2025-12-01T18:33:39.894Z'::timestamptz),
  (gen_random_uuid(), 'steven.peterson@magshield.com', 'XV1TJPWSW3ZTPD0SS2KP6JNNT0', 'Steven Peterson', '2025-12-01T21:35:32.798Z'::timestamptz),
  (gen_random_uuid(), 'chris.koehler@cox.net', '2TRT6972QZNCZ3ZW494G1C9S4C', 'Chris Koehler', '2025-12-01T22:09:44.541Z'::timestamptz),
  (gen_random_uuid(), 'kathleenmascarenas@gmail.com', '3AJV85K5X60TC9Y616F176GH88', 'Kathleen Mascarenas', '2025-12-01T22:25:34.068Z'::timestamptz),
  (gen_random_uuid(), 'ken@onewaygc.com', '5AX2PQWFR4JSY9DE1KK632FWJ0', 'Ken Morrow', '2025-12-01T22:33:21.479Z'::timestamptz),
  (gen_random_uuid(), 'jgibbs30@yahoo.com', 'GZ6FVWD3ZYWDNQNA2544NXP6WC', 'Jeff Gibbs', '2025-12-01T22:44:32.828Z'::timestamptz),
  (gen_random_uuid(), 'jjgiannotti@gmail.com', 'SNREX2NV31F0JEJFT28FWXKSE8', 'Joe Giannotti', '2025-12-02T23:25:12.495Z'::timestamptz),
  (gen_random_uuid(), 'sidobj11@gmail.com', 'V848Y5RY6H26YQHPPMESYAN20R', 'Sid Benavidez', '2025-12-03T15:57:56.189Z'::timestamptz),
  (gen_random_uuid(), 'jstewart761@gmail.com', '77EZM4BGNMC1H0RQRK1J2GBFCW', 'Jeff Stewart', '2025-12-04T22:44:18.786Z'::timestamptz),
  (gen_random_uuid(), 'zarfaq@gmail.com', 'Q3810WXN1HKCMR36F941G7HBA4', 'Zarfaq Jaffery', '2025-12-04T22:53:47.188Z'::timestamptz),
  (gen_random_uuid(), 'jmarts7@yahoo.com', 'FXSDNRV24DYWYEHSPP1FJ2RXZ4', 'John Marts', '2025-12-05T17:59:22.373Z'::timestamptz),
  (gen_random_uuid(), 'valentidavide@yahoo.com', 'WEZPASBJHKCKZFGHBMHDN047SM', 'David Valenti', '2025-12-05T18:28:55.207Z'::timestamptz),
  (gen_random_uuid(), 'scj25@me.co', 'FV5JDCAE2S0HPGFEPTT3N9HD20', 'Chris Stanley', '2025-12-08T16:57:11.84Z'::timestamptz),
  (gen_random_uuid(), 'lisa1sanford@gmail.com', '8QHKVD3N1QTVQRMVJ4GQQ3Q844', 'Lisa Sanford', '2025-12-08T22:10:21.020Z'::timestamptz),
  (gen_random_uuid(), 'vpscorey@gmail.com', '3XDKVPDYHM36XJMCF8T6YWTKKC', 'Corey Jackson', '2025-12-09T21:42:58.906Z'::timestamptz),
  (gen_random_uuid(), 'brandonfrees@yahoo.com', '1FCTXDAC9Q78SX3P4D08SZW4RC', 'Brandon Frees', '2025-12-10T22:00:21.702Z'::timestamptz),
  (gen_random_uuid(), 'connant_vps@msn.com', 'W65TXTRHZ3J2TDB3TTCM9AYZ6W', 'David Connant', '2025-12-11T21:32:54.648Z'::timestamptz),
  (gen_random_uuid(), 'timmcafee@gmail.com', '68HRAB9NNJV510S8T4VYKDPVXC', 'Tim Mcafee', '2025-12-12T14:08:41.114Z'::timestamptz),
  (gen_random_uuid(), 'azshawn@aol.com', '3E4J9RBKZSD624ZP5RAPWYZSCG', 'Shawn Cummins', '2025-12-12T15:26:19.454Z'::timestamptz),
  (gen_random_uuid(), 'emb1453@aol.com', '3HRNMCKTEEHRZFS54CVJPJK1XW', 'Adeline Lupton', '2025-12-12T17:15:28.407Z'::timestamptz),
  (gen_random_uuid(), 'rickrumsey5@gmail.com', '8S6ESGGT7NZ7HJ1XFB7E277JSR', 'Rick Rumsey', '2025-12-12T18:59:19.043Z'::timestamptz),
  (gen_random_uuid(), 'lefty20@aol.com', 'C6KHJN5B0A03G0VDKCKSYCTWWR', 'Tim Nedin', '2025-12-15T17:53:18.859Z'::timestamptz),
  (gen_random_uuid(), 'jbevan01@cox.net', 'J9KPYKQ1X9Z0KTAN64YH6RZ8MW', 'Jerry Bevan', '2025-12-18T21:46:43.166Z'::timestamptz),
  (gen_random_uuid(), 'angelotrujillo@cox.net', 'PKD18RY9Q7Z8M6JK4NS2TX87T4', 'Angelo Trujillo', '2025-12-19T14:56:48.346Z'::timestamptz),
  (gen_random_uuid(), 'taniastreun@gmail.com', '5NPN73NNFRS81NFDZ5K5VWS5PC', 'Tania Streun-Gotwalt', '2025-12-19T15:00:45.63Z'::timestamptz),
  (gen_random_uuid(), 'kendalltessar@gmail.com', 'VKS8F8CAG3DJHH1DW59F9BHJNW', 'Kendall Tessar', '2025-12-19T15:40:18.36Z'::timestamptz),
  (gen_random_uuid(), 'jblairmerritt@yahoo.com', '822TRE53MQE06XCWQ22JXNBTNR', 'Jackie Blair Merritt', '2025-12-19T18:41:16.947Z'::timestamptz),
  (gen_random_uuid(), 'rburchett@rwwusa.com', '6S3EY0S4TYZ413B2JN5K6MY720', 'Elizabeth Burchett', '2025-12-22T17:20:54.92Z'::timestamptz),
  (gen_random_uuid(), 'michaeledwards62@outlook.com', 'TC5VGDNSJS72WV4WCVW4YGB20C', 'Michael Edwards', '2025-12-22T20:32:05.086Z'::timestamptz),
  (gen_random_uuid(), 'jdsaran@tjoil.net', 'W3H9B2Z5BN043BAH4Y50Y98Z5G', 'JD Saran', '2025-12-22T21:09:48.199Z'::timestamptz),
  (gen_random_uuid(), 'bill.tessar@outlook.com', 'NBE87SN9503W47EQSXK65W254G', 'William Tessar', '2025-12-26T17:10:22.277Z'::timestamptz),
  (gen_random_uuid(), 'jprescott@prsrentals.com', 'CDKTNYG1RKCE0JNYZK15AKXJQC', 'john Prescott', '2026-01-06T21:11:04.67Z'::timestamptz),
  (gen_random_uuid(), 'midwestjeff@cox.net', '6MT2RXK7E2ND2HW63JP08XYK4R', 'Jeff Herman', '2026-01-07T15:34:30.952Z'::timestamptz),
  (gen_random_uuid(), 'arizonacombatsports@yahoo.com', '90ZH4X6NBWBZ3K3GJF1VPAQ038', 'Trevor Lally', '2026-01-07T16:04:38.869Z'::timestamptz),
  (gen_random_uuid(), 'garretthancock27@gmail.com', 'CVQXAMTH7KGRQJSC2QPE9XDE3C', 'Garrett Hancock', '2026-01-08T19:19:13.98Z'::timestamptz),
  (gen_random_uuid(), 'workwithamyjo@gmail.com', 'MPF1ZXRD9PGXAKE160D5KCFDYR', 'Amy Hancock', '2026-01-08T19:19:34.084Z'::timestamptz),
  (gen_random_uuid(), 'wooddj7@gmail.com', 'J41ZY9CBBZ1163PGSEG3YJ4S48', 'Derrick Wood', '2026-01-08T22:18:01.465Z'::timestamptz),
  (gen_random_uuid(), 'natecastile@gmail.com', 'X2CG6TS6K28YNAM7YCJGSN2PCR', 'Denny Castile', '2026-01-08T22:44:23.349Z'::timestamptz),
  (gen_random_uuid(), 'joelovesliving@gmail.com', '8Q42HM7SB7BXKY3PG4VDN860VM', 'Joe Daly', '2026-01-16T14:45:34.579Z'::timestamptz),
  (gen_random_uuid(), 'carl.l.miller@hotmail.com', '78HSZ859Y2FBY8RZW6GNQ26S7R', 'Carl Miller', '2026-01-20T15:07:28.321Z'::timestamptz),
  (gen_random_uuid(), 'momrockz@msn.com', 'EDJTNDHPPEA4ZH0QSNZK13620R', 'Charla Kuhne', '2026-01-20T16:03:05.646Z'::timestamptz),
  (gen_random_uuid(), 'markeggleston13@gmail.com', 'M25PTPHBHBEE626KAQS4FGB58G', 'Mark Eggleston', '2026-01-20T20:29:15.503Z'::timestamptz),
  (gen_random_uuid(), 'sunmerk@gmail.com', 'ETTKCTEZX8BZKFTS5S26AM2D4W', 'Rodney Merkley', '2026-01-21T16:02:15.056Z'::timestamptz),
  (gen_random_uuid(), 'eloken922@yahoo.com', 'S837ZH5Y7XHA5ZKXT7XRPW9YB4', 'Eric Loken', '2026-01-22T21:16:15.309Z'::timestamptz),
  (gen_random_uuid(), 'kguariglio@me.com', 'V260G3NVGQZFBZYX8MCHK3TSR8', 'Ki M Guariglio', '2026-01-26T17:06:51.158Z'::timestamptz),
  (gen_random_uuid(), 'mikebarth@ymail.com', 'Q8S8GA9EJJN6SVS9ZAWP19AAE0', 'Michael Barth', '2026-01-26T17:50:30.967Z'::timestamptz),
  (gen_random_uuid(), 'scotborg@comast.net', 'XNZBE2QMWMED77YQTZ4EFYZ8B0', 'Scot Borg', '2026-01-26T21:05:53.145Z'::timestamptz),
  (gen_random_uuid(), 'josh.m.messina@gmail.com', 'QRYM077DYBHPH4133G2VMQ1MHC', 'Josh Messina', '2026-01-26T22:03:26.648Z'::timestamptz),
  (gen_random_uuid(), 'rmacqueen1@cox.net', 'N7K1N9D92Z2NDBTBA23QTY25XW', 'Richard MacQueen', '2026-01-27T22:41:57.747Z'::timestamptz),
  (gen_random_uuid(), 'bernie34@cox.net', 'MAA9K3D41QX5R60EGADX6QZDJ4', 'Bernadette Pineda', '2026-01-28T16:40:44.513Z'::timestamptz),
  (gen_random_uuid(), 'allinhyland@gmail.com', 'XMGRJM45YFKP269AFQ03VZQ3C8', 'David Hyland', '2026-01-29T20:56:23.178Z'::timestamptz),
  (gen_random_uuid(), 'jaydin15@yahoo.com', 'TBV9CM604KXNQV7VV78SCG7YQR', 'Jay Din', '2026-01-29T22:06:51.667Z'::timestamptz),
  (gen_random_uuid(), 'ccaraz@gmail.com', 'R5B7DTWP3QJSK6D9PH5Y2MFSDC', 'Gerald H.   (Chip) Carr III', '2026-01-30T17:32:27.308Z'::timestamptz),
  (gen_random_uuid(), 'jerald.utter@gmail.com', 'WSXG44GWSE0B0EDNHD3SW1F7E8', 'Jerald Utter', '2026-02-09T17:36:13.889Z'::timestamptz),
  (gen_random_uuid(), 'devlinrice@cox.net', 'D3QG2V0N9G6V250CBAM7CTEPJ8', 'Devlin Rice', '2026-02-13T14:43:04.715Z'::timestamptz),
  (gen_random_uuid(), 'jessica_apostle@hotmail.com', 'NX1WWG3R0DXZFBAFM1APK3BWRM', NULL, '2026-02-24T01:08:44.545Z'::timestamptz),
  (gen_random_uuid(), 'rjacobsaylor@gmail.com', 'S7ZAW2J3GEBDJVW6DQ0DP2VEQ4', 'Jake Saylor', '2026-02-26T22:45:07.476Z'::timestamptz),
  (gen_random_uuid(), 'crabbkris@gmail.com', 'YHX9V7863ZHTQ9J0YSCZHNTAMC', 'Kristin Crabb', '2026-02-27T17:41:34.111Z'::timestamptz),
  (gen_random_uuid(), 'crabbmark01@gmail.com', 'CRY2SS6E6W301HW4RB3FK6JCF8', 'Mark  Crabb', '2026-02-27T17:46:01.142Z'::timestamptz),
  (gen_random_uuid(), 'sjardina@hotmail.com', 'AJ5DVPK52HAZBS45QJ2KE52NBC', 'Steve Jardina', '2026-03-06T18:02:28.559Z'::timestamptz),
  (gen_random_uuid(), 'rscotford@reagan.com', 'DKKKCF2GY7NM55D51H2MGFC95R', 'Rob Scotford', '2026-03-06T18:09:39.126Z'::timestamptz),
  (gen_random_uuid(), 'rudreads45@gmail.com', 'C0T6YC3YD0TY60VD932TGVCTBC', 'Robert Auer', '2026-03-09T14:55:48.252Z'::timestamptz)
ON CONFLICT (email) DO NOTHING;

-- 3. Memberships table (if not already present)
CREATE TABLE IF NOT EXISTS public.memberships (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier       text NOT NULL DEFAULT 'standard',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_read_own_membership"
  ON public.memberships FOR SELECT
  USING (auth.uid() = user_id);

-- 4. Trigger function: on new auth.users insert, check legacy_customers by email
CREATE OR REPLACE FUNCTION public.handle_new_user_legacy_check()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.legacy_customers
    WHERE email = lower(NEW.email)
  ) THEN
    INSERT INTO public.memberships (user_id, tier)
    VALUES (NEW.id, 'legacy')
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

-- 5. Attach trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created_legacy_check ON auth.users;
CREATE TRIGGER on_auth_user_created_legacy_check
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_legacy_check();
