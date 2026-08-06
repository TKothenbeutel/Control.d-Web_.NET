using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace ControlDWeb.Controllers
{
    public class AuthorizationHelper
    {

        private readonly IConfiguration _config;

        private readonly SymmetricSecurityKey secretKey;

        private readonly SigningCredentials signingCredentials;

        public AuthorizationHelper(){}

        public AuthorizationHelper(IConfiguration config)
        {
            _config = config;

            secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetValue<string>("AppIdentitySettings:SecurityKey")));

            signingCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
        }

        public string GenerateToken(List<(string, string)> claims)
        {
            List<Claim> claimList = new List<Claim>();
            foreach (var pair in claims)
            {
                claimList.Add(new Claim(pair.Item1, pair.Item2));
            }

            var tokenOptions = new JwtSecurityToken(
                issuer: "Controld",
                audience: "http://localhost:3000",
                claims: claimList,
                expires: DateTime.Now.AddMinutes(2),
                signingCredentials: signingCredentials
            );
            var tokenString = new JwtSecurityTokenHandler().WriteToken(tokenOptions);
            return tokenString;
        }

        public string GenerateRefreshToken()
        {
            //Generate token
            var randomNumber = new byte[64];
            var token = "";
            using(var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                token = Convert.ToBase64String(randomNumber);
            }

            //Hash token
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(token));
            return Convert.ToBase64String(hashedBytes);

        }
    }
}